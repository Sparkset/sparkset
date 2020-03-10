<template>
  <div id="search">
    <div id="search__exit" @click="$store.commit('closeGlobalSearch')"></div>
    <div
      id="search__area"
      @keydown.up.prevent="selectedResult = Math.max(selectedResult - 1, 0)"
      @keydown.down.prevent="
        selectedResult = Math.min(selectedResult + 1, results.length - 1)
      "
      @keydown.shift.tab.prevent="
        selectedResult = Math.max(selectedResult - 1, 0)
      "
      @keydown.exact.tab.prevent="
        selectedResult = Math.min(selectedResult + 1, results.length - 1)
      "
      @keydown.esc="$store.commit('closeGlobalSearch')"
    >
      <input
        type="text"
        :class="[results.length ? 'has-results' : null]"
        v-model="query"
        v-focus
        @input="getResults"
        @keydown.enter="$store.commit('closeGlobalSearch')"
      />
      <div v-if="results.length" id="results">
        <button
          v-for="(result, index) in results"
          :key="result.id"
          :class="['result', index === selectedResult ? 'selected' : null]"
          @mousemove="selectedResult = index"
          @click="$store.commit('closeGlobalSearch')"
        >
          <span class="result__name">
            {{ result.get("fullName") }}
          </span>
          <span class="result__company">
            {{ result.get("company").get("name") }}
          </span>
        </button>
      </div>
    </div>
  </div>
</template>

<script>
import AV from "leancloud-storage";
export default {
  name: "TheGlobalSearch",
  data() {
    return {
      query: "",
      results: [],
      selectedResult: 0
    };
  },
  methods: {
    getResults() {
      const vm = this;
      const keywords = vm.query
        .replace(/[^a-zA-Z0-9]/g, " ")
        .split(" ")
        .filter(keyword => keyword);
      if (keywords.length) {
        const fields = [
          "fullName",
          "nickName",
          "jobTitle",
          "email",
          "cellPhone",
          "workPhone"
        ];
        AV.Query.and(
          ...keywords.map(keyword =>
            AV.Query.or(
              ...fields.map(field =>
                new AV.Query("Client").matches(field, new RegExp(keyword, "i"))
              ),
              new AV.Query("Client").matchesQuery(
                "company",
                new AV.Query("Company").matches(
                  "name",
                  new RegExp(keyword, "i")
                )
              )
            )
          )
        )
          .include("company")
          .limit(5)
          .find()
          .then(clients => {
            vm.results = clients;
            vm.selectedResult = 0;
          })
          .catch(error => {
            alert(error);
          });
      } else {
        vm.results = [];
      }
    }
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
#search__area > input {
  border: none;
  padding: 12px;
}
#search__area > input.has-results {
  border-bottom: 1px solid rgba(204, 204, 204, 0.43);
  border-radius: 2px 2px 0 0;
}
#results {
  width: 100%;
  background-color: #fff;
  border-radius: 0 0 2px 2px;
  overflow: hidden;
}
.result {
  display: block;
  width: 100%;
  height: 46px;
  padding: 0 12px;
}
.result.selected {
  background-color: #36d5d8;
  color: #fff;
}
.result__name {
  float: left;
  font-weight: 500;
}
.result__company {
  float: right;
}
@media (min-width: 544px) {
  #search__area {
    margin: 32px auto;
    width: calc(100% - 64px);
  }
}
</style>