<template>
  <div id="search">
    <button
      id="search__exit"
      @click="$store.commit('closeGlobalSearch')"
      tabindex="-1"
    ></button>
    <div id="search__area">
      <input type="text" v-model="query" v-focus @input="getResults" />
      <div v-if="query" id="results">
        <button v-for="result in results" :key="result.id" class="result">
          <span class="result__name"
            >{{ result.get("firstName") }} {{ result.get("lastName") }}</span
          >
          <span class="result__company">{{
            result.get("company").get("name")
          }}</span>
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
      results: []
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
          "firstName",
          "lastName",
          "nickName",
          "jobTitle",
          "email",
          "cellPhone"
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
#results {
  position: absolute;
  top: 40px;
  width: 100%;
  padding: 6px 0 0 0;
  background-color: #fff;
  border-radius: 0 0 2px 2px;
}
.result {
  display: block;
  border-top: 1px solid rgba(204, 204, 204, 0.43);
  width: 100%;
  height: 46px;
  padding: 0 12px;
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
