<template>
  <th @click="sortBy(by)">
    <slot></slot>
    <span v-if="by === sortedBy">
      <font-awesome-icon
        :icon="[
          'fas',
          sortOrder === 1 ? 'long-arrow-alt-up' : 'long-arrow-alt-down'
        ]"
      />
    </span>
  </th>
</template>

<script>
export default {
  name: "ThWithSort",
  props: {
    by: String,
    sortedBy: String,
    sortOrder: Number,
    sortBy: Function
  }
};
</script>

<style scoped>
th {
  cursor: pointer;
}
th > span > svg {
  opacity: 0.4;
}
</style>
