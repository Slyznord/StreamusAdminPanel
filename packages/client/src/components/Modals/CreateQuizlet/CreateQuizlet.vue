<template>
  <vue-final-modal
    v-slot="{ close }"
    v-bind="$attrs"
    classes="modal"
    content-class="modal__container modal__container_medium"
    :lock-scroll="false"
    :esc-to-close="true"
    @before-open="overwriteParams($event)"
  >
    <div
      v-if="quiz"
      class="container container_h-full column"
    >
      <div class="actions-panel actions-panel_justify-between actions-panel_mb-2">
        <h2 class="headline">Создание квиза</h2>

        <div class="row">
          <Button
            value="Сохранить"
            classes="button button_normal button_success mr-2"
            @click="onSaveQuiz(close)"
          />

          <Button
            value="Отменить"
            classes="button button_normal button_error"
            @click="onCloseHandler(close)"
          />
        </div>
      </div>

      <Input
        class="mb-4"
        :classes="[
          'input'
        ]"
        :model-value="quiz.introduction_text"
        @update:model-value="onUpdateInput($event, 'introduction_text')"
      >
        <template #label>
          <Label
            value="Текст приветствия"
            classes="input-group__label"
          />
        </template>
      </Input>

      <Input
        class="mb-4"
        :classes="[
          'input'
        ]"
        :model-value="quiz.duration"
        @update:model-value="onUpdateTimer($event)"
      >
        <template #label>
          <Label
            value="Длительность квиза"
            classes="input-group__label"
          />
        </template>
      </Input>

      <UploadFile
        :filename="quiz.logo"
        class="mb-4"
        @upload-file="onUploadFile($event, 'logo')"
      />

      <div class="container column mb-5">
        <Label
          value="Цвет фона"
          classes="input-group__label"
        />

        <ColorPicker
          theme="dark"
          :color="quiz.background"
          :sucker-hide="true"
          :sucker-canvas="suckerCanvas"
          :sucker-area="suckerArea"
          @changeColor="onChangeColor"
        />
      </div>

      <CreateQuestion
        :elements="quiz.questions"
      />
    </div>
  </vue-final-modal>
</template>

<script>
import { computed, onMounted, ref, toRefs, watch } from 'vue'
import { useStore } from 'vuex'
import quizCaching from '@/utils/quizCaching'

import Button from '@/components/UI/Button'
import { ColorPicker } from 'vue-color-kit'
import CreateQuestion from './CreateQuestion'
import Input from '@/components/UI/Input'
import Label from '@/components/UI/Label'
import UploadFile from '@/components/UI/UploadFile'

import ModalMixin from '@/mixins/Modal.mixin'

import 'vue-color-kit/dist/vue-color-kit.css'

export default {
  name: 'CreateQuizlet',
  mixins: [ModalMixin],
  components: {
    Button,
    ColorPicker,
    CreateQuestion,
    UploadFile,
    Input,
    Label
  },
  props: {
    element: {
      type: Object,
      default: null
    },
    isEditing: {
      type: Boolean,
      default: false
    }
  },
  setup (props) {
    const { element, isEditing } = toRefs(props)
    const store = useStore()

    onMounted(() => {
      store.commit('Quizlet/initCreatedQuiz', JSON.parse(JSON.stringify(element.value)))
    })

    const quiz = computed(() => {
      return store.state.Quizlet.createdQuiz
    })
    const suckerCanvas = ref(null)
    const suckerArea = ref([])

    function onUpdateInput (value, key) {
      store.commit('Quizlet/updateCreatedQuiz', {
        value,
        key
      })
    }

    function onUpdateTimer (value) {
      onUpdateInput(value, 'duration')
    }

    // function formattingDuration (time) {
    //   let timeStr = time.toString()
    //
    //   if (timeStr.match(/[a-zа-яё]/i)) timeStr = timeStr.replace(/[a-zа-яё]/gi, '')
    //   if (timeStr.length <= 2) timeStr = timeStr.length > 1 ? `${timeStr}:00` : `0${timeStr}:00`
    //
    //   return timeStr
    // }

    async function onUploadFile (file, key) {
      if (file === null) {
        store.commit('Quizlet/updateCreatedQuiz', {
          value: '',
          key
        })
        return
      }

      const formData = new FormData()
      formData.append('file', file)

      const result = await store.dispatch('Quizlet/uploadFile', formData)
      store.commit('Quizlet/updateCreatedQuiz', {
        value: result.name,
        key
      })
    }

    function onChangeColor (color) {
      const { rgba: { r, g, b, a } } = color

      store.commit('Quizlet/updateCreatedQuiz', {
        key: 'background',
        value: `rgba(${r}, ${g}, ${b}, ${a})`
      })
    }

    const isThereEmptyBaseFields = () => {
      const { introduction_text: introductionText, duration, logo } = quiz.value
      return !(introductionText && duration && logo)
    }
    const isThereQuestions = () => {
      return Boolean(quiz.value.questions.length)
    }
    const isThereEmptyQuestions = () => {
      return quiz.value.questions.some(item => !item.content)
    }
    const isThereQuestionsWithoutAnswers = () => {
      return quiz.value.questions.some(item => !item.answers.length)
    }
    const isThereQuestionWithoutRightAnswer = () => {
      return !quiz.value.questions.some(question => question.answers.some(answer => answer.is_right))
    }
    const isThereEmptyAnswer = () => {
      return quiz.value.questions.some(question => question.answers.some(answer => !answer.content))
    }

    function isThereAnyEmptyField () {
      if (isThereEmptyBaseFields()) {
        alert('Заполнены не все поля (текст приветствия, длительность квиза или секция)')
        return true
      }

      if (!isThereQuestions()) {
        alert('Не добавлены вопросы')
        return true
      }

      if (isThereEmptyQuestions()) {
        alert('Все вопросы должны быть с текстом')
        return true
      }

      if (isThereQuestionsWithoutAnswers()) {
        alert('У некоторых вопросов нету ответов')
        return true
      }

      if (isThereEmptyAnswer()) {
        alert('У некоторых вопросов есть путсые ответы')
        return true
      }

      if (isThereQuestionWithoutRightAnswer()) {
        alert('У некоторых вопросов не выбран правильный ответ')
        return true
      }
    }

    watch(quiz, (value) => {
      quizCaching(value)
    },
    {
      deep: true
    })

    function onCloseHandler (close) {
      quizCaching(null)
      close()
    }

    async function onSaveQuiz (close) {
      if (isThereAnyEmptyField()) return

      if (isEditing.value) {
        await store.dispatch('Quizlet/updateQuiz', quiz.value)
      } else {
        await store.dispatch('Quizlet/createQuiz', quiz.value)
      }

      quizCaching(null)
      close()
    }

    return {
      quiz,
      suckerArea,
      suckerCanvas,
      onChangeColor,
      onCloseHandler,
      onSaveQuiz,
      onUpdateInput,
      onUploadFile,
      onUpdateTimer
    }
  }
}
</script>
