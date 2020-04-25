<template>
  <div>
    <h1>Events</h1>
    <EventsTable :events="events"></EventsTable>
  </div>
</template>

<script>
import AV from "leancloud-storage";
import EventsTable from "@/components/EventsTable.vue";
export default {
  name: "CompanyEvents",
  data() {
    return {
      companyClients: [],
      events: []
    };
  },
  components: {
    EventsTable
  },
  created() {
    const vm = this;
    const clientsQuery = new AV.Query("Client");
    clientsQuery.equalTo(
      "company",
      AV.Object.createWithoutData("Company", vm.$route.params.id)
    );
    clientsQuery
      .find()
      .then(function(clients) {
        vm.companyClients = clients;
        for (const client in vm.companyClients) {
          console.log(typeof clients);
          console.log(typeof client);
          const eventsQuery = new AV.Query("Event");
          eventsQuery.equalTo("client", client);
          eventsQuery.equalTo("done", false);
          eventsQuery
            .descending("createdAt")
            .limit(1000)
            .find()
            .then(function(events) {
              for (const event in events) {
                vm.events.push(event);
              }
            })
            .catch(error => {
              alert(error);
            });
        }
      })
      .catch(error => {
        alert(error);
      });
  }
};
</script>

<style scoped></style>
