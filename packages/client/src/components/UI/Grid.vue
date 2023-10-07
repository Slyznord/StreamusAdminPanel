<template>
  <div
    :class="[
      'grid',
      classes
    ]"
  >
    <slot />
  </div>
</template>

<script>
export default {
  name: 'Grid',
  props: {
    classes: {
      type: String,
      default: ''
    }
  }
}
</script>
