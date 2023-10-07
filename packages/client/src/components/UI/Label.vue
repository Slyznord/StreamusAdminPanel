<template>
  <label
    v-if="value"
    :class="classes"
  >
    {{ value }}
  </label>
</template>

<script>
export default {
  name: 'Label',
  props: {
    value: {
      type: [String, Number],
      default: ''
    },
    classes: {
      type: String,
      default: ''
    }
  }
}
</script>
