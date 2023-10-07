<template>
  <div
    v-for="(item, index) in tabs"
    :key="index"
    :class="[
      classes,
      activeTab.value === index ? activeClass : ''
    ]"
    @click="callback(index)"
  >
    {{ item }}
  </div>
</template>

<script>
import { inject } from 'vue'

export default {
  name: 'TabItem',
  props: {
    classes: {
      type: Array,
      default: () => []
    },
    activeClass: {
      type: Array,
      default: () => []
    },
    tabs: {
      type: Array,
      default: () => []
    },
    callback: {
      type: Function,
      default: () => { return false }
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
