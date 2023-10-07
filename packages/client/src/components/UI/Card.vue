<template>
  <div :class="[
    classes,
    'card'
  ]">
    <slot
      :isLoading="isLoading"
      :switchLoaderState="switchLoaderState"
    />
  </div>
</template>

<script>
import { ref } from 'vue'

export default {
  name: 'Card',
  props: {
    classes: {
      type: String,
      default: ''
    }
  },
  setup () {
    const isLoading = ref(false)
    const switchLoaderState = (value) => {
      isLoading.value = value
    }

    return {
      isLoading,
      switchLoaderState
    }
  }
}
</script>
