<template>
  <div>
    <div id="exit" @click="$store.commit('closeGlobalSearch')"></div>
    <div
      id="main"
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
        @keydown.enter="goToSelectedItem"
      />
      <div v-if="results.length" id="results">
        <button
          v-for="(result, index) in results"
          :key="result.id"
          :class="['result', index === selectedResult ? 'selected' : null]"
          @mousemove="selectedResult = index"
          @click="goToSelectedItem"
        >
          <span v-if="result.className === 'Client'">
            <span class="result__left">
              <font-awesome-icon :icon="['fas', 'user']" />
              {{ result.get("fullName") }}
            </span>
            <span class="result__right">
              {{ result.get("company").get("name") }}
            </span>
          </span>
          <span v-if="result.className === 'Note'">
            <span class="result__left">
              <font-awesome-icon :icon="['fas', 'sticky-note']" />
              {{ result.get("title") }}
            </span>
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
        const clientFields = [
          "fullName",
          "nickname",
          "jobTitle",
          "email",
          "cellPhone",
          "workPhone"
        ];
        const clientQuery = AV.Query.and(
          ...keywords.map(keyword =>
            AV.Query.or(
              ...clientFields.map(field =>
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
          .limit(3);
        const noteFields = ["title", "content"];
        const noteQuery = AV.Query.and(
          ...keywords.map(keyword =>
            AV.Query.or(
              ...noteFields.map(field =>
                new AV.Query("Note").matches(field, new RegExp(keyword, "i"))
              )
            )
          )
        )
          .include("owner")
          .limit(2);
        clientQuery
          .find()
          .then(clients => {
            noteQuery.find().then(notes => {
              vm.results = [...clients, ...notes];
              vm.selectedResult = 0;
            });
          })
          .catch(error => {
            alert(error);
          });
      } else {
        vm.results = [];
      }
    },
    goToSelectedItem() {
      const vm = this;
      vm.$store.commit("closeGlobalSearch");
      const className = vm.results[vm.selectedResult].className;
      if (className === "Client") {
        vm.$router.push(`/client/${vm.results[vm.selectedResult].id}`);
      }
      if (className === "Note") {
        vm.$router.push(`/notes#${vm.results[vm.selectedResult].id}`);
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
#exit {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background-color: #00000099;
}
#main {
  position: absolute;
  margin: 24px auto;
  right: 0;
  left: 0;
  width: calc(100% - 48px);
  max-width: 720px;
}
#main > input {
  border: none;
  margin: 0;
  padding: 12px;
  border-radius: 4px;
}
#main > input.has-results {
  border-bottom: 1px solid #e5e5e5;
  border-radius: 4px 4px 0 0;
}
#results {
  width: 100%;
  background-color: #fff;
  border-radius: 0 0 4px 4px;
  overflow: hidden;
}
#results * {
  transition: unset;
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
.result__left {
  float: left;
  font-weight: 500;
}
.result__right {
  float: right;
}
@media (min-width: 544px) {
  #main {
    margin: 32px auto;
    width: calc(100% - 64px);
  }
}
</style>
