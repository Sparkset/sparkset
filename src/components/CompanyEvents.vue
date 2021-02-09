<template>
  <section class="fields">
    <h1>{{ companyName }} Events</h1>
    <div class="field field--superwide">
      <h2>Individual Client Events</h2>
      <EventsTable :events="clientEvents" :fetch-events="fetchClientEvents" />
    </div>
    <div class="field field--superwide">
      <h2>Company-Wide Events</h2>
      <EventsTable :events="companyEvents" :fetch-events="fetchCompanyEvents" />
    </div>
    <div v-if="!creatingCustomEvent" class="field">
      <button class="primary" @click="creatingCustomEvent = true">
        Create Custom Event
      </button>
    </div>
    <AddEvent v-else @cancel-event="cancel" @create-event="createEvent" />
  </section>
</template>

<script>
import AV from "leancloud-storage";
import EventsTable from "@/components/EventsTable.vue";
import AddEvent from "@/components/AddEvent.vue";
export default {
  name: "CompanyEvents",
  data() {
    return {
      companyName: "",
      clientEvents: [],
      companyEvents: [],
      creatingCustomEvent: false,
      companyClients: []
    };
  },
  components: {
    EventsTable,
    AddEvent
  },
  created() {
    const vm = this;
    vm.getCompanyName();
    vm.fetchEvents();
  },
  methods: {
    fetchEvents() {
      const vm = this;
      vm.fetchClientEvents();
      vm.fetchCompanyEvents();
    },
    fetchClientEvents() {
      const vm = this;
      const clientsQuery = new AV.Query("Client");
      clientsQuery.equalTo(
        "company",
        AV.Object.createWithoutData("Company", vm.$route.params.id)
      );
      const eventsQuery = new AV.Query("Event");
      eventsQuery
        .notEqualTo("time", null)
        .matchesQuery("client", clientsQuery)
        .equalTo("done", false)
        .exists("client")
        .include("client")
        .limit(1000)
        .find()
        .then(events => {
          vm.clientEvents = events.map(event => ({
            event,
            editing: false,
            pendingChanges: {
              date: `${event.get("time").getFullYear()}-${`0${event
                .get("time")
                .getMonth() + 1}`.slice(-2)}-${`0${event
                .get("time")
                .getDate()}`.slice(-2)}`,
              time: `${`0${event.get("time").getHours()}`.slice(
                -2
              )}:${`0${event.get("time").getMinutes()}`.slice(-2)}`
            }
          }));
        })
        .catch(error => {
          alert(error);
        });
    },
    fetchCompanyEvents() {
      const vm = this;
      const eventsQuery = new AV.Query("Event");
      eventsQuery
        .notEqualTo("time", null)
        .equalTo("done", false)
        .equalTo(
          "company",
          AV.Object.createWithoutData("Company", vm.$route.params.id)
        )
        .find()
        .then(events => {
          vm.companyEvents = events.map(event => ({
            event,
            editing: false,
            pendingChanges: {
              date: `${event.get("time").getFullYear()}-${`0${event
                .get("time")
                .getMonth() + 1}`.slice(-2)}-${`0${event
                .get("time")
                .getDate()}`.slice(-2)}`,
              time: `${`0${event.get("time").getHours()}`.slice(
                -2
              )}:${`0${event.get("time").getMinutes()}`.slice(-2)}`
            }
          }));
        })
        .catch(error => {
          alert(error);
        });
    },
    getCompanyName() {
      const vm = this;
      const companyQuery = new AV.Query("Company");
      companyQuery
        .get(vm.$route.params.id)
        .then(company => {
          vm.companyName = company.get("name");
        })
        .catch(error => {
          alert(error);
        });
    },
    createEvent(newEvent) {
      const vm = this;
      const event = new AV.Object("Event");
      event
        .set(
          "company",
          AV.Object.createWithoutData("Company", vm.$route.params.id)
        )
        .set("name", newEvent.name)
        .set(
          "time",
          new Date(
            newEvent.date.slice(0, 4),
            newEvent.date.slice(5, 7) - 1,
            newEvent.date.slice(8, 10),
            newEvent.time.slice(0, 2),
            newEvent.time.slice(3, 5),
            0
          )
        );
      if (newEvent.recurringEvent) {
        event.set("recursIn", newEvent.daysBetween);
      }
      event
        .save()
        .then(() => {
          alert("Event created.");
          vm.fetchEvents();
          vm.creatingCustomEvent = false;
        })
        .catch(error => {
          alert(error);
        });
    },
    cancel() {
      const vm = this;
      vm.creatingCustomEvent = false;
    }
  }
};
</script>

<style scoped></style>
