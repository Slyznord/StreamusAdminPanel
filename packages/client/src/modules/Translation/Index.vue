<template>
  <div class="container flex-col justify-center">
    <Settings class="mb-8" />

    <Tabs
      :buttons="tabParams.buttons"
      :headers="tabParams.headers"
      :items="tabs"
      title="Секции"
      class="mb-12"
    />

    <Codes
      :buttons="codeParams.buttons"
      :headers="codeParams.headers"
      :items="codes"
      title="Ключи доступа"
    />
  </div>
</template>

<script>
import { ref, onMounted, computed } from 'vue'
import { useStore } from 'vuex'
import Api from '@/api/api'

import Codes from './Codes.vue'
import Tabs from './Tabs.vue'
import Settings from './Settings.vue'

import ClockClockwiseIcon from '@/assets/icons/ClockClockwise.svg'
import EmailIcon from '@/assets/icons/Email.svg'
import FinnTheHumanIcon from '@/assets/icons/FinnTheHuman.svg'
import KeyIcon from '@/assets/icons/Key.svg'
import LinkSimpleIcon from '@/assets/icons/LinkSimple.svg'
import UserIcon from '@/assets/icons/User.svg'

export default {
  name: 'Translation',
  components: {
    Codes,
    Settings,
    Tabs
  },
  setup () {
    const store = useStore()
    const codeParams = ref({
      buttons: [
        {
          id: 0,
          label: 'Имортировать ключи',
          classes: 'button button_big button_primary',
          onClick: async (event) => {
            const file = event.target.files[0]
            const formData = new FormData()

            formData.append('file', file)

            await Api.post('v2/translation/code/import', {
              data: formData
            })

            const codes = await store.dispatch('Translation/getCodes')
            store.commit('Translation/setCodes', codes)
          }
        },
        {
          id: 1,
          label: 'Добавить ключ',
          classes: 'button button_normal button_success',
          onClick: () => store.commit('Translation/addCode')
        },
        {
          id: 2,
          label: 'Удалить все ключи',
          classes: 'button button_normal button_error',
          onClick: async () => {
            await store.dispatch('Translation/deleteCodes')
          }
        }
      ],
      headers: [
        {
          column: 'code',
          label: 'Ключ',
          classesHeader: 'flex flex-row items-center w-1/5 self-center text-lg font-semibold',
          classesIcon: 'mr-2',
          classesItem: 'text-gray-500',
          icon: KeyIcon,
          onClick: () => {}
        },
        {
          column: 'name',
          label: 'Имя',
          classesHeader: 'flex flex-row items-center w-1/4 self-center text-lg font-semibold',
          classesIcon: 'mr-2',
          classesItem: 'text-gray-500',
          icon: UserIcon,
          onClick: () => {}
        },
        {
          column: 'email',
          label: 'Email',
          classesHeader: 'flex flex-row items-center w-1/4 self-center text-lg font-semibold',
          classesIcon: 'mr-2',
          classesItem: 'text-gray-500',
          icon: EmailIcon,
          onClick: () => {}
        },
        {
          column: 'last_activity',
          label: 'Активность',
          classesHeader: 'flex flex-row items-center w-1/5 self-center text-lg font-semibold',
          classesIcon: 'mr-2',
          classesItem: 'text-gray-500',
          icon: ClockClockwiseIcon,
          onClick: () => {}
        },
        {
          column: 'actions',
          label: '',
          classesHeader: 'w-16',
          classesItem: 'hidden cursor-pointer transition transition-all duration-500 hover:text-red-300'
        }
      ]
    })
    const tabParams = ref({
      buttons: [
        {
          label: 'Добавить секцию',
          classes: 'button button_normal button_success',
          onClick: () => store.commit('Translation/addTab')
        }
      ],
      headers: [
        {
          column: 'tab',
          label: 'Секция',
          classesHeader: 'flex flex-row items-center w-2/6 self-center text-lg font-semibold',
          classesIcon: 'mr-2',
          classesItem: 'text-gray-500',
          icon: FinnTheHumanIcon,
          onClick: () => {}
        },
        {
          column: 'url',
          label: 'Ссылка',
          classesHeader: 'flex flex-row items-center w-1/2 self-center text-lg font-semibold',
          classesIcon: 'mr-2',
          classesItem: 'text-gray-500 cursor-pointer transition transition-all duration-500 hover:text-red-300',
          icon: LinkSimpleIcon,
          onClick: () => {}
        },
        {
          column: 'actions',
          label: '',
          classesHeader: 'w-16',
          classesItem: 'hidden cursor-pointer transition transition-all duration-500 hover:text-red-300',
          classesIcon: 'flex ml-auto cursor-pointer wr-table__expand-icon'
        }
      ]
    })

    onMounted(async () => {
      const codes = await store.dispatch('Translation/getCodes')
      const tabs = await store.dispatch('Translation/getTabs')

      store.commit('Translation/setCodes', codes)
      store.commit('Translation/setTabs', tabs)
    })

    const codes = computed(() => store.state.Translation.codes)
    const tabs = computed(() => store.state.Translation.tabs)

    return {
      codes,
      codeParams,
      tabs,
      tabParams
    }
  }
}
</script>
