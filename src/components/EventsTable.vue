<template>
  <table>
    <thead>
      <tr>
        <ThWithSort
          v-if="showClient"
          by="client"
          :sorted-by="sortedBy"
          :sort-order="sortOrder"
          :sort-by="sortBy"
        >
          Client
        </ThWithSort>
        <ThWithSort
          by="name"
          :sorted-by="sortedBy"
          :sort-order="sortOrder"
          :sort-by="sortBy"
        >
          Event
        </ThWithSort>
        <ThWithSort
          by="time"
          :sorted-by="sortedBy"
          :sort-order="sortOrder"
          :sort-by="sortBy"
        >
          Time
        </ThWithSort>
        <th>Option</th>
      </tr>
    </thead>
    <tbody>
      <tr v-for="event in sortedEvents" :key="event.event.id">
        <div v-if="showClient">
          <td v-if="!event.companyWide">
            <ClientCombo :client="event.event.get('client')" />
          </td>
          <td v-if="event.event.get('company')">
            <CompanyCombo :company="event.event.get('company')" />
          </td>
        </div>
        <td>
          <label>
            <span>
              {{ event.event.get("name") }}
              <div v-if="event.event.get('company')" class="icon">
                <font-awesome-icon :icon="['fas', 'building']" />
              </div>
            </span>
          </label>
        </td>
        <td>
          <form v-if="event.editing" @submit.prevent="update(event)">
            <div class="field">
              <input
                type="date"
                max="2099-12-31"
                v-model="event.pendingChanges.date"
                required
              />
            </div>
            <div class="field">
              <input type="time" v-model="event.pendingChanges.time" required />
            </div>
            <div class="field">
              <button class="primary">
                Save
              </button>
            </div>
          </form>
          <a v-else @click="event.editing = true">
            {{
              event.event.get("time").toLocaleString("en-US", {
                year: "numeric",
                month: "numeric",
                day: "numeric",
                hour: "numeric",
                minute: "numeric"
              })
            }}
          </a>
        </td>
        <td>
          <button
            v-if="!event.editing"
            :class="[event.event.get('done') ? '' : 'primary']"
            @click="toggle(event)"
          >
            {{ event.event.get("done") ? "Undone" : "Done" }}
          </button>
        </td>
      </tr>
    </tbody>
  </table>
</template>

<script>
import ThWithSort from "@/components/ThWithSort.vue";
import ClientCombo from "@/components/ClientCombo.vue";
import CompanyCombo from "@/components/CompanyCombo.vue";
import AV from "leancloud-storage";
export default {
  name: "EventsTable",
  components: {
    ThWithSort,
    ClientCombo,
    CompanyCombo
  },
  props: {
    events: Array,
    showClient: Boolean,
    fetchEvents: Function
  },
  data() {
    return {
      sortedBy: "time",
      sortOrder: 1
    };
  },
  methods: {
    sortBy(field) {
      const vm = this;
      vm.sortOrder = vm.sortedBy === field ? -vm.sortOrder : 1;
      vm.sortedBy = field;
    },
    update(event) {
      const vm = this;
      event.event.set(
        "time",
        new Date(
          event.pendingChanges.date.slice(0, 4),
          event.pendingChanges.date.slice(5, 7) - 1,
          event.pendingChanges.date.slice(8, 10),
          event.pendingChanges.time.slice(0, 2),
          event.pendingChanges.time.slice(3, 5),
          0
        )
      );
      if (event.lastEvent) {
        event.lastEvent.unset("recursIn");
        AV.Object.saveAll([event.event, event.lastEvent])
          .then(vm.fetchEvents)
          .catch(error => {
            alert(error);
          });
      } else {
        event.event
          .save()
          .then(() => {
            event.editing = false;
          })
          .catch(error => {
            alert(error);
          });
      }
    },
    toggle(event) {
      const vm = this;
      event.event
        .set("done", !event.event.get("done"))
        .save()
        .then(vm.fetchEvents)
        .catch(error => {
          alert(error);
        });
    }
  },
  computed: {
    sortedEvents() {
      const vm = this;
      return vm.events.sort((a, b) =>
        a.event.get(vm.sortedBy) > b.event.get(vm.sortedBy)
          ? vm.sortOrder
          : -vm.sortOrder
      );
    }
  }
};
</script>

<style scoped>
span {
  display: flex;
}

.icon {
  margin-left: 10px;
}
</style>
