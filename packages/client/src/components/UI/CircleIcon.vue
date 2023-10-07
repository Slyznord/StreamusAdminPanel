<template>
  <div :class="[
    'icon__container',
    classes
  ]">
    <slot />
  </div>
</template>

<script>
export default {
  name: 'CircleIcon',
  props: {
    classes: {
      type: String,
      default: ''
    }
  }
}
</script>
