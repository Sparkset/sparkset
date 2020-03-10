<template>
  <div>
    <router-view id="page" :key="$route.path"></router-view>
  </div>
</template>

<script>
export default {
  name: "TheAuthWrapper"
};
</script>

<style scoped>
#page {
  margin: 0 auto;
  padding: 0 24px 24px 24px;
}
@media (min-width: 544px) {
  #page {
    padding: 0 32px 64px 32px;
  }
}
</style>
