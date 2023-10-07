<template>
  <div class="flex items-center w-auto gap-4">
    <slot name="left-text" />

    <label>
      <input
        type="checkbox"
        class="switch"
        :checked="modelValue"
        @input="$emit('update:modelValue', { value: $event.target.checked, event: $event })"
      >
    </label>

    <slot name="right-text" />
  </div>
</template>

<script>
export default {
  name: 'Switch',
  props: {
    modelValue: {
      type: Boolean,
      required: true
    }
  }
}
</script>
