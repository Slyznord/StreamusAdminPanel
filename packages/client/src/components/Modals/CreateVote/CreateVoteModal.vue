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
    <div class="container container_h-full column">
      <h2 class="headline mb-6">Создание голосования</h2>

      <div class="flex flex-row items-center gap-4 mb-6">
        <div
          v-for="(item, index) in tabs"
          :key="index"
          :class="[
            'flex justify-center items-center px-6 p-2 rounded-md cursor-pointer transition-all duration-500 hover:bg-primary',
            selectedTab && selectedTab.tab_id === item.tab_id ? 'bg-primary' : 'bg-gray-300'
          ]"
          @click="() => {}"
        >
          <span class="text-base font-semibold text-white">{{ item.name }}</span>
        </div>
      </div>

      <div class="flex flex-col items-center w-full gap-4 mb-6">
        <div
          v-for="(item, index) in presentations"
          :key="index"
          class="flex flex-row w-full gap-4"
        >
          <input
            v-model="item.speaker"
            type="text"
            class="input input_shadow"
            placeholder="Название доклада"
          >

          <TrashIcon
            class="w-7 text-gray-500 cursor-pointer transition transition-all duration-500 hover:text-gray-700 stroke-1"
            @click="onDeletePresentation(item, index)"
          />
        </div>

        <span
          v-if="!presentations.length"
          class="text-sm font-semibold text-gray-500"
        >
          Докладов нету
        </span>
      </div>

      <div class="flex row gap-4">
        <Button
          v-for="(item, index) in buttons"
          :key="index"
          :value="item.value"
          :classes="item.classes"
          @click="item.onClick(close)"
        >
          <template v-if="item.icon" #icon>
            <component
              :is="item.icon.name"
              :class="item.icon.classes"
            />
          </template>
        </Button>
      </div>
    </div>
  </vue-final-modal>
</template>

<script>
import Button from '@/components/UI/Button'
import ModalMixin from '@/mixins/Modal.mixin'

import { PlusCircleIcon, TrashIcon } from '@heroicons/vue/outline'
import { ref, computed, onMounted } from 'vue'
import { useStore } from 'vuex'

export default {
  name: 'CreateVoteModal',
  mixins: [ModalMixin],
  props: {
    vote: {
      type: Object,
      default: null
    },
    elements: {
      type: Array,
      default: null
    },
    isEditing: {
      type: Boolean,
      default: false
    }
  },
  components: {
    Button,
    PlusCircleIcon,
    TrashIcon
  },
  setup (props) {
    // const { vote, isEditing } = toRefs(props)
    const store = useStore()
    const buttons = ref([
      {
        value: 'Добавить',
        classes: 'button button_normal button_primary',
        icon: {
          name: 'PlusCircleIcon',
          classes: 'w-5 text-white stroke-1 mr-2'
        },
        onClick: () => {
          presentations.value.push({ speaker: '' })
        }
      },
      {
        value: 'Сохранить',
        classes: 'button button_normal button_success',
        icon: null,
        onClick: (fn) => {
          // onSaveVote(fn)
        }
      },
      {
        value: 'Отменить',
        classes: 'button button_normal button_error',
        icon: null,
        onClick: (fn) => {
          fn()
        }
      }
    ])
    const tabs = computed(() => {
      return store.state.Translation.tabs
    })
    const presentations = ref([])
    const selectedTab = ref(null)

    onMounted(async () => {
      if (!store.state.Translation.tabs) {
        const tabs = await store.dispatch('Translation/getTabs')
        store.commit('Translation/setTabs', tabs)

        selectedTab.value = tabs[0].tab_id
      }
    })

    return {
      buttons,
      presentations,
      selectedTab,
      tabs
    }
  }
}
</script>
