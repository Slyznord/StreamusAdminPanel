<template>
  <div>
    <div :class="classes">
      <div
          v-for="(header, index) in headers"
          :key="index"
          :class="header.classesHeader"
          @click="header.onClick"
      >
        <img
          v-if="header.icon"
          :src="header.icon"
          :class="header.classesIcon"
        >

        {{ header.label }}
      </div>
    </div>

    <div :class="classesRowContainer">
      <slot />
    </div>
  </div>
</template>

<script>
export default {
  name: 'Table',
  props: {
    headers: {
      type: Array,
      default: () => []
    },
    classes: {
      type: [Array, String],
      default: () => []
    },
    classesRowContainer: {
      type: [Array, String],
      default: () => []
    }
  }
}
</script>
