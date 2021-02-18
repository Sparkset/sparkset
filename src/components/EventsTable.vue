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
        <td v-if="showClient">
          <CompanyCombo
            v-if="event.event.get('company')"
            :company="event.event.get('company')"
          />
          <ClientCombo v-else :client="event.event.get('client')" />
        </td>
        <td>
          <router-link :to="`/event/${event.event.id}`">
            {{ event.event.get("name") }}
            <font-awesome-icon
              v-if="event.event.get('company')"
              :icon="['fas', 'building']"
            />
          </router-link>
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
              <button type="submit" class="primary">
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
          <button v-if="!event.event.id" @click="dismiss(event)">
            Dismiss
          </button>
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
    },
    dismiss(event) {
      const vm = this;
      event.lastEvent
        .unset("recursIn")
        .save()
        .then(vm.fetchEvents)
        .catch(error => {
          alert(error);
        });
    },
    compareOwner(a, b) {
      return (
        (a.event.get("client") != null
          ? a.event
              .get("client")
              .get("fullName")
              .toLowerCase()
          : a.event
              .get("company")
              .get("name")
              .toLowerCase()) >
        (b.event.get("client") != null
          ? b.event
              .get("client")
              .get("fullName")
              .toLowerCase()
          : b.event
              .get("company")
              .get("name")
              .toLowerCase())
      );
    },
    compareEventName(a, b) {
      return (
        a.event.get("name").toLowerCase() > b.event.get("name").toLowerCase()
      );
    }
  },
  computed: {
    sortedEvents() {
      const vm = this;
      if (vm.sortedBy === "name") {
        return vm.events.sort((a, b) =>
          vm.compareEventName(a, b) ||
          (a.event.get("name").toLowerCase() ==
            b.event.get("name").toLowerCase() &&
            a.event.get("time") > b.event.get("time")) ||
          (a.event.get("name").toLowerCase() ==
            b.event.get("name").toLowerCase() &&
            a.event.get("time") == b.event.get("time") &&
            vm.compareOwner(a,b))
            ? vm.sortOrder
            : -vm.sortOrder
        );
      } else if (vm.sortedBy === "client") {
        return vm.events.sort((a, b) =>
          vm.compareOwner(a, b) ||
          ((a.event.get("client") != null
            ? a.event
                .get("client")
                .get("fullName")
                .toLowerCase()
            : a.event
                .get("company")
                .get("name")
                .toLowerCase()) ==
            (b.event.get("client") != null
              ? b.event
                  .get("client")
                  .get("fullName")
                  .toLowerCase()
              : b.event
                  .get("company")
                  .get("name")
                  .toLowerCase()) &&
            a.event.get("time") > b.event.get("time"))
            ? vm.sortOrder
            : -vm.sortOrder
        );
      }
      return vm.events.sort((a, b) =>
        a.event.get(vm.sortedBy) > b.event.get(vm.sortedBy)
          ? vm.sortOrder
          : -vm.sortOrder
      );
    }
  }
};
</script>

<style scoped></style>
