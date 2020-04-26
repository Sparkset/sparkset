<template>
  <section class="fields">
    <h1>{{ companyName }} Events</h1>
    <div class="field field--superwide">
      <EventsTable :events="events" :fetch-events="fetchEvents" />
    </div>
  </section>
</template>


<script>
import AV from "leancloud-storage";
import EventsTable from "@/components/EventsTable.vue";
export default {
  name: "CompanyEvents",
  data() {
    return {
      companyName: "",
      events: []
    };
  },
  components: {
    EventsTable
  },
  created() {
    const vm = this;
    vm.getCompanyName();
    vm.fetchEvents();
  },
  methods: {
    fetchEvents() {
      const vm = this;
      const clientsQuery = new AV.Query("Client");
      clientsQuery.equalTo(
        "company",
        AV.Object.createWithoutData("Company", vm.$route.params.id)
      );
      const eventsQuery = new AV.Query("Event");
      eventsQuery
        .matchesQuery("client", clientsQuery)
        .equalTo("done", false)
        .include("client")
        .descending("createdAt")
        .limit(1000)
        .find()
        .then(events => {
          vm.events = events.map(event => ({
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
    }
  }
};
</script>

<style scoped></style>
