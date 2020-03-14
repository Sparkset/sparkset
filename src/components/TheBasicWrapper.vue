<template>
  <div>
    <router-view id="page" :key="$route.path"></router-view>
  </div>
</template>

<script>
export default {
  name: "TheBasicWrapper"
};
</script>

<style scoped>
#page {
  margin: 0 auto;
  padding: 0 24px 88px 24px;
  width: 100%;
  overflow: auto;
}
@media (min-width: 544px) {
  #page {
    padding: 0 32px 88px 32px;
  }
}
@media (min-width: 800px) {
  #page {
    padding: 0 32px 64px 32px;
  }
}
@media (min-width: 1792px) {
  #page {
    width: 1536px;
  }
}
</style>
