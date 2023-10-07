<template>
  <div class="settings">
    <component
      :is="icon"
      :class="iconClasses"
      @click="switchSettingsState"
    />

    <div
      v-show="isOpen"
      class="settings__content"
    >
      <p
        v-if="title"
        class="subtitle subtitle_font-base subtitle_semibold mb-3"
      >
        {{ title }}
      </p>

      <slot
        name="button"
        :switchSettingsState="switchSettingsState"
      />
    </div>
  </div>
</template>

<script>
import { ref } from 'vue'

export default {
  name: 'Settings',
  props: {
    icon: {
      type: Function,
      required: true
    },
    iconClasses: {
      type: String,
      default: ''
    },
    elements: {
      type: Array,
      default: () => []
    },
    title: {
      type: String,
      default: ''
    }
  },
  setup () {
    const isOpen = ref(false)

    function switchSettingsState () {
      isOpen.value = !isOpen.value
    }

    return {
      isOpen,
      switchSettingsState
    }
  }
}
</script>
