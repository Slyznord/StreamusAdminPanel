<template>
  <div class="input-group">
    <slot name="label" />
    <input
      :autocomplete="autocompleteType"
      :value="modelValue"
      :type="type"
      :class="classes"
      @change="$emit('update:modelValue', $event.target.value)"
    >
  </div>
</template>

<script>
export default {
  name: 'Input',
  props: {
    modelValue: {
      type: [String, Number],
      required: true
    },
    type: {
      type: String,
      default: 'text'
    },
    autocompleteType: {
      type: String,
      default: ''
    },
    classes: {
      type: [String, Array],
      default: ''
    }
  }
}
</script>
