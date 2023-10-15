<template>
  <div
    v-for="(item, index) in items"
    :key="index"
    :class="classes"
  >
    <div
      v-for="(header, key) in headers"
      :key="key"
      :class="[
        headers[key].classesHeader,
        headers[key].classesItem
      ]"
    >
      <slot
        :name="`item[${header.column}]`"
        :index="index"
        :item="item"
        :column="header.column"
      >
        {{ item[header.column] }}
      </slot>
    </div>

    <slot
      name="controls"
      :index="index"
      :item="item"
    />
  </div>
</template>

<script>
export default {
  name: 'Row',
  props: {
    headers: {
      type: Array,
      default: () => []
    },
    items: {
      type: Array,
      default: () => []
    },
    classes: {
      type: [Array, String],
      default: () => []
    }
  }
}
</script>
