<template>
  <div v-if="activeTab.value === number">
    <slot />
  </div>
</template>

<script>
import { inject } from 'vue'

export default {
  name: 'Tab',
  props: {
    number: {
      type: Number,
      required: true
    }
  },
  setup () {
    const activeTab = inject('activeTab')

    return {
      activeTab
    }
  }
}
</script>
