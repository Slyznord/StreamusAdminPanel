<template>
  <div
    v-if="settings"
    class="flex flex-col w-full mb-8"
  >
    <div class="flex flex-row items-center justify-between mb-4">
      <h2 class="text-xl font-semibold">Настройки</h2>

      <Switch
        :model-value="isEnglish"
        @update:model-value="onChangeLanguage"
      >
        <template #left-text>
          <span class="text-base font-semibold text-gray-600">RU</span>
        </template>

        <template #right-text>
          <span class="text-base font-semibold text-gray-600">EN</span>
        </template>
      </Switch>
    </div>

    <div
      v-if="!isEnglish"
      class="flex flex-col"
    >
      <div class="flex flex-col w-full mb-6">
        <label class="text-sm font-semibold text-gray-300 mb-2">Заголовок</label>

        <div class="flex flex-row items-center gap-4">
          <input
            :value="settings.title_ru"
            type="text"
            :class="[
              'input input_shadow',
              { 'input_disable' : !isTitleEditing }
            ]"
            :disabled="!isTitleEditing"
            @change="updateSettings({ value: $event.target.value, property: 'title_ru' })"
          >

          <PencilAltIcon
            v-if="!isTitleEditing"
            class="w-6 text-gray-500 cursor-pointer transition transition-all duration-500 hover:text-gray-700 stroke-1"
            @click="isTitleEditing = !isTitleEditing"
          />

          <SaveIcon
            v-else
            class="w-6 text-gray-500 cursor-pointer transition transition-all duration-500 hover:text-green-600 stroke-1"
            @click="onSaveSettings"
          />
        </div>
      </div>

      <div class="flex flex-col w-full mb-12">
        <label class="text-sm font-semibold text-gray-300 mb-2">Подзаголовок</label>

        <div class="flex flex-row items-center gap-4">
          <input
            :value="settings.subtitle_ru"
            type="text"
            :class="[
              'input input_shadow',
              { 'input_disable' : !isSubtitleEditing }
            ]"
            :disabled="!isSubtitleEditing"
            @change="updateSettings({ value: $event.target.value, property: 'subtitle_ru' })"
          >

          <PencilAltIcon
            v-if="!isSubtitleEditing"
            class="w-6 text-gray-500 cursor-pointer transition transition-all duration-500 hover:text-gray-700 stroke-1"
            @click="isSubtitleEditing = !isSubtitleEditing"
          />

          <SaveIcon
            v-else
            class="w-6 text-gray-500 cursor-pointer transition transition-all duration-500 hover:text-green-600 stroke-1"
            @click="onSaveSettings"
          />
        </div>
      </div>
    </div>

    <div
      v-else
      class="flex flex-col"
    >
      <div class="flex flex-col w-full mb-6">
        <label class="text-sm font-semibold text-gray-300 mb-2">Title</label>

        <div class="flex flex-row items-center gap-4">
          <input
            :value="settings.title_en"
            type="text"
            :class="[
              'input input_shadow',
              { 'input_disable' : !isTitleEditing }
            ]"
            :disabled="!isTitleEditing"
            @change="updateSettings({ value: $event.target.value, property: 'title_en' })"
          >

          <PencilAltIcon
            v-if="!isTitleEditing"
            class="w-6 text-gray-500 cursor-pointer transition transition-all duration-500 hover:text-gray-700 stroke-1"
            @click="isTitleEditing = !isTitleEditing"
          />

          <SaveIcon
            v-else
            class="w-6 text-gray-500 cursor-pointer transition transition-all duration-500 hover:text-green-600 stroke-1"
            @click="onSaveSettings"
          />
        </div>
      </div>

      <div class="flex flex-col w-full mb-12">
        <label class="text-sm font-semibold text-gray-300 mb-2">Subtitle</label>

        <div class="flex flex-row items-center gap-4">
          <input
            :value="settings.subtitle_en"
            type="text"
            :class="[
              'input input_shadow',
              { 'input_disable' : !isSubtitleEditing }
            ]"
            :disabled="!isSubtitleEditing"
            @change="updateSettings({ value: $event.target.value, property: 'subtitle_en' })"
          >

          <PencilAltIcon
            v-if="!isSubtitleEditing"
            class="w-6 text-gray-500 cursor-pointer transition transition-all duration-500 hover:text-gray-700 stroke-1"
            @click="isSubtitleEditing = !isSubtitleEditing"
          />

          <SaveIcon
            v-else
            class="w-6 text-gray-500 cursor-pointer transition transition-all duration-500 hover:text-green-600 stroke-1"
            @click="onSaveSettings"
          />
        </div>
      </div>
    </div>

    <UploadFile
      :allowed-extensions="['ico', 'png']"
      title="Загрузить favicon"
      classes="button button_big button_primary"
      @upload:file="uploadFavicon($event)"
    />
  </div>
</template>

<script>
import Switch from '@/components/UI/Switch.vue'
import UploadFile from '@/components/UI/UploadFile.vue'

import { PencilAltIcon, SaveIcon } from '@heroicons/vue/outline'
import { ref, computed, reactive, onMounted } from 'vue'
import { useStore } from 'vuex'

export default {
  name: 'Settings',
  components: {
    PencilAltIcon,
    SaveIcon,
    Switch,
    UploadFile
  },
  setup () {
    const store = useStore()
    const isTitleEditing = ref(false)
    const isSubtitleEditing = ref(false)
    const isEnglish = ref(false)

    onMounted(async () => {
      await getSettings()
    })

    const settings = computed(() => {
      return reactive(store.state.Translation.settings)
    })

    async function getSettings () {
      const settings = await store.dispatch('Translation/getSettings')

      if (settings.success) {
        store.commit('Translation/setSettings', settings.data)
      } else {
        console.error(settings)
      }
    }

    async function uploadFavicon (file) {
      if (!file) return alert('Сначала загрузите файл')

      const formData = new FormData()
      formData.append('file', file)

      const fileURL = await store.dispatch('Translation/uploadFile', formData)

      store.commit('Translation/setSettings', { property: 'favicon', value: fileURL })
      await store.dispatch('Translation/saveSettings')
    }

    function onChangeLanguage (event) {
      isEnglish.value = event.value
    }

    async function onSaveSettings () {
      await store.dispatch('Translation/saveSettings')

      isTitleEditing.value = false
      isSubtitleEditing.value = false
    }

    return {
      isEnglish,
      isTitleEditing,
      isSubtitleEditing,
      settings,
      onChangeLanguage,
      onSaveSettings,
      updateSettings: ({ property, value }) => store.commit('Translation/updateSettings', { property, value }),
      uploadFavicon
    }
  }
}
</script>
