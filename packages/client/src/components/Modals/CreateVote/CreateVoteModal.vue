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
      <h2 class="headline mb-6">{{ title }}</h2>

      <div class="flex flex-row items-center gap-4 mb-6">
        <div
          v-for="(item, index) in tabs"
          :key="index"
          :class="[
            'flex justify-center items-center px-6 p-2 rounded-md cursor-pointer transition-all duration-500 hover:bg-primary',
            selectedTab === item.tab_id ? 'bg-blue-200' : 'bg-gray-300'
          ]"
          @click="onSelectTab(item.tab_id)"
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
            v-model="item.name"
            type="text"
            class="input input_shadow"
            placeholder="Название доклада"
            @change="onUpdatePresentation(item)"
          >

          <TrashIcon
            class="w-7 text-gray-500 cursor-pointer transition transition-all duration-500 hover:text-gray-700 stroke-1"
            @click="removePresentation(item?.presentation_id, index)"
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
import { ref, computed, onMounted, toRefs } from 'vue'
import { useStore } from 'vuex'

export default {
  name: 'CreateVoteModal',
  mixins: [ModalMixin],
  props: {
    isEditing: {
      type: Boolean,
      default: false
    },
    title: {
      type: String,
      default: 'Создание голосования'
    },
    vote: {
      type: Object,
      default: () => {}
    }
  },
  components: {
    Button,
    PlusCircleIcon,
    TrashIcon
  },
  setup (props) {
    const { isEditing, vote } = toRefs(props)
    const store = useStore()
    const buttons = ref([
      {
        value: 'Добавить',
        classes: 'button button_normal button_primary',
        icon: {
          name: 'PlusCircleIcon',
          classes: 'w-5 text-white stroke-1 mr-2'
        },
        onClick: async () => {
          let payload = {
            name: 'Введите название доклада'
          }

          if (isEditing.value) {
            const newPresentation = await store.dispatch('Vote/createPresentation', {
              ...payload,
              vote_id: vote.value.vote_id
            })

            payload = {
              ...payload,
              presentation_id: newPresentation.presentation_id
            }
          }

          presentations.value.push(payload)
        }
      },
      {
        value: 'Сохранить',
        classes: 'button button_normal button_success',
        icon: null,
        onClick: async (fn) => {
          if (isEditing.value) {
            await getVotes()
            fn()

            return
          }

          await onSaveVote(fn)
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
    const selectedTab = ref(null)
    const presentations = ref([])

    onMounted(async () => {
      const updatedTabs = await store.dispatch('Translation/getTabs')
      store.commit('Translation/setTabs', updatedTabs)

      if (updatedTabs.length) {
        selectedTab.value = isEditing.value ? vote.value.tab_id : updatedTabs[0].tab_id
      }

      if (isEditing.value) {
        const { vote_id: voteID } = vote.value
        const targetVote = await store.dispatch('Vote/getVotes', { vote_id: voteID })

        presentations.value = targetVote.presentations
      }
    })

    async function onSaveVote (close) {
      if (!selectedTab.value) {
        return alert('Нужно выбать секцию для которой создается голосование')
      }

      if (!presentations.value.length) {
        return alert('Нужно добавить хотя бы один доклад для голосования')
      }

      const { tab_id: tabID, name } = tabs.value.find(item => item.tab_id === selectedTab.value)
      const payload = {
        tab_id: tabID,
        tab_name: name,
        presentations: presentations.value
      }

      await store.dispatch('Vote/createVote', payload)
      await getVotes()
      close()
    }

    async function onSelectTab (tabID) {
      selectedTab.value = tabID

      if (isEditing.value) {
        const targetTab = tabs.value.find(item => item.tab_id === tabID)

        await store.dispatch('Vote/updateVote', {
          vote_id: vote.value.vote_id,
          tab_id: targetTab.tab_id,
          tab_name: targetTab.name
        })
      }
    }

    async function onUpdatePresentation (item) {
      if (isEditing.value) {
        await store.dispatch('Vote/updatePresentation', { name: item.name, presentation_id: item.presentation_id })
      }
    }

    async function removePresentation (id, index) {
      presentations.value.splice(index, 1)

      if (isEditing.value) {
        await store.dispatch('Vote/deletePresentation', { presentation_id: id })
      }
    }

    async function getVotes () {
      const votes = await store.dispatch('Vote/getVotes')
      store.commit('Vote/setVotes', votes)
    }

    return {
      buttons,
      presentations,
      onSelectTab,
      onUpdatePresentation,
      removePresentation,
      selectedTab,
      tabs
    }
  }
}
</script>
