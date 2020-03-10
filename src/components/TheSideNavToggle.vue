<template>
  <div
    title="Toggle menu."
    tabindex="0"
    @click="$store.commit('toggleSideNav')"
    @keypress.enter="$store.commit('toggleSideNav')"
  >
    <font-awesome-icon icon="bars" />
  </div>
</template>

<script>
export default {
  name: "TheSideNavToggle"
};
</script>

<style scoped></style>
