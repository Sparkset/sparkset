<template>
  <div id="search">
    <button
      id="search__exit"
      @click="$store.commit('closeSearch')"
      tabindex="-1"
    ></button>
    <div id="search__area">
      <input type="text" v-model="searchQuery" v-focus />
    </div>
  </div>
</template>

<script>
export default {
  name: "TheSearch",
  data() {
    return {
      searchQuery: ""
    };
  },
  directives: {
    focus: {
      inserted(el) {
        el.focus();
      }
    }
  }
};
</script>

<style scoped>
#search {
  position: fixed;
  top: 0;
  right: 0;
  bottom: 0;
  left: 0;
}
#search__exit {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background-color: #00000099;
}
#search__area {
  position: absolute;
  margin: 24px auto;
  right: 0;
  left: 0;
  width: calc(100% - 48px);
  max-width: 720px;
}
@media (min-width: 544px) {
  #search__area {
    margin: 32px auto;
    width: calc(100% - 64px);
  }
}
</style>
