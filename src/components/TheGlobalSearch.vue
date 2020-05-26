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
          <div v-if="result.className === 'Client'">
            <div class="icon">
              <font-awesome-icon :icon="['fas', 'user']" />
            </div>
            <div class="content">
              <div class="primary">
                {{ result.get("fullName") }}
              </div>
              <div class="secondary">
                <span class="type">Client</span>
                {{ result.get("company").get("name") }}
              </div>
            </div>
          </div>
          <div v-if="result.className === 'Event'">
            <div class="icon">
              <font-awesome-icon :icon="['fas', 'calendar-day']" />
            </div>
            <div class="content">
              <div class="primary">
                {{ result.get("name") }}
              </div>
              <div class="secondary">
                <span class="type">Event</span>
                {{
                  result.get("time").toLocaleString("en-US", {
                    year: "numeric",
                    month: "numeric",
                    day: "numeric",
                    hour: "numeric",
                    minute: "numeric"
                  })
                }}
                with
                {{
                  result.get("client")
                    ? result.get("client").get("fullName")
                    : result.get("company").get("name")
                }}
              </div>
            </div>
          </div>
          <div v-if="result.className === 'Note'">
            <div class="icon">
              <font-awesome-icon :icon="['fas', 'sticky-note']" />
            </div>
            <div class="content">
              <div class="primary">
                {{ result.get("title") }}
              </div>
              <div class="secondary">
                <span class="type">Note</span>
                {{ result.get("content") }}
              </div>
            </div>
          </div>
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
    async getResults() {
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
        const clients = await AV.Query.and(
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
          .descending("updatedAt")
          .limit(3)
          .find();
        const events = await AV.Query.and(
          ...keywords.map(keyword =>
            new AV.Query("Event").matches("name", new RegExp(keyword, "i"))
          )
        )
          .include("client")
          .include("company")
          .descending("updatedAt")
          .limit(3)
          .find();
        const noteFields = ["title", "content"];
        const notes = await AV.Query.and(
          ...keywords.map(keyword =>
            AV.Query.or(
              ...noteFields.map(field =>
                new AV.Query("Note").matches(field, new RegExp(keyword, "i"))
              )
            )
          )
        )
          .include("owner")
          .descending("updatedAt")
          .limit(3)
          .find();
        vm.results = [...clients, ...events, ...notes];
        vm.selectedResult = 0;
      } else {
        vm.results = [];
      }
    },
    goToSelectedItem() {
      const vm = this;
      vm.$store.commit("closeGlobalSearch");
      vm.$store.commit("closeSideNav");
      const className = vm.results[vm.selectedResult].className;
      if (className === "Client") {
        vm.$router.push(`/client/${vm.results[vm.selectedResult].id}`);
      }
      if (className === "Event") {
        vm.$router.push(`/event/${vm.results[vm.selectedResult].id}`);
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
  padding: 8px 12px;
}
.result.selected {
  background-color: #36d5d8;
  color: #fff;
}
.result > div {
  display: flex;
}
.result > div > .content {
  padding-left: 8px;
}
.result > div > .content > .primary,
.result > div > .content > .secondary {
  text-align: left;
}
.result > div > .content > .primary {
  font-weight: 500;
}
.result > div > .content > .secondary {
  font-size: 9pt;
  opacity: 0.6;
}
.result > div > .content > .secondary > .type {
  background-color: #605e5e22;
  padding: 0 4px;
  border-radius: 2px;
  text-transform: uppercase;
}
.result.selected > div > .content > .secondary > .type {
  background-color: #fff;
  color: #36d5d8;
}
@media (min-width: 544px) {
  #main {
    margin: 32px auto;
    width: calc(100% - 64px);
  }
}
</style>
