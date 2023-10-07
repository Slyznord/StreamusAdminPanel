<template>
  <div class="tabs__header tabs__row">
    <div :class="classes">
      <slot
        name="tabs"
        :callback="selectTab"
      />
    </div>

    <slot name="extend" />
  </div>

  <slot name="tab" />
</template>

<script>
import { reactive, provide } from 'vue'

export default {
  name: 'Tabs',
  props: {
    classes: {
      type: Array,
      default: () => []
    }
  },
  emits: ['update-tab'],
  setup (props, { emit }) {
    const activeTabKey = 'werial_active_tab'
    const savedActiveTab = localStorage.getItem(activeTabKey)
    const activeTab = reactive({
      value: +savedActiveTab ?? 0
    })

    provide('activeTab', activeTab)

    function selectTab (index) {
      localStorage.setItem(activeTabKey, index)
      activeTab.value = index
      emit('update-tab', index)
    }

    return {
      activeTab,
      selectTab
    }
  }
}
</script>
