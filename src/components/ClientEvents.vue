<template>
  <section class="fields">
    <div v-if="!creatingCustomEvent" class="field" id="createButton">
      <button class="primary" @click="creatingCustomEvent = true">
        Create Custom Event
      </button>
    </div>
    <AddEvent v-else @cancel-event="cancel" @create-event="createEvent" />
    <div id="eventLists">
    <h1>Upcoming</h1>
    <div class="field field--superwide">
      <EventsTable :events="upcomingEvents" :fetch-events="fetchEvents" />
    </div>
    <h1>Suggested</h1>
    <div class="field field--superwide">
      <EventsTable :events="suggestedEvents" :fetch-events="fetchEvents" />
    </div>
    <h1>Past</h1>
    <div class="field field--superwide">
      <EventsTable :events="pastEvents" :fetch-events="fetchEvents" />
    </div>
    </div>
  </section>
</template>

<script>
import EventsTable from "@/components/EventsTable.vue";
import AV from "leancloud-storage";
import AddEvent from "@/components/AddEvent.vue";
export default {
  name: "ClientEvents",
  components: {
    EventsTable,
    AddEvent
  },
  data() {
    return {
      upcomingEvents: [],
      suggestedEvents: [],
      pastEvents: [],
      companyEvents: [],
      creatingCustomEvent: false,
      company: new AV.Object("Company")
    };
  },
  created() {
    const vm = this;
    vm.fetchCompany();
  },
  methods: {
    fetchCompany() {
      const vm = this;
      const clientyQuery = new AV.Query("Client");
      clientyQuery
        .get(vm.$route.params.id)
        .then(client => {
          vm.company = client.get("company");
          vm.fetchEvents();
        })
        .catch(error => {
          alert(error);
        });
    },
    fetchEvents() {
      const vm = this;
      const innerClientQuery = new AV.Query("Event");
      innerClientQuery.equalTo(
        "client",
        AV.Object.createWithoutData("Client", vm.$route.params.id)
      );
      const innerCompanyQuery = new AV.Query("Event");
      innerCompanyQuery.equalTo("company", vm.company);
      AV.Query.or(innerClientQuery, innerCompanyQuery)
        .notEqualTo("time", null)
        .equalTo("done", false)
        .include("client")
        .limit(1000)
        .find()
        .then(upcomingEvents => {
          vm.upcomingEvents = upcomingEvents.map(event => ({
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
      AV.Query.or(innerClientQuery, innerCompanyQuery)
        .notEqualTo("time", null)
        .equalTo("done", true)
        .exists("recursIn")
        .include("client")
        .limit(1000)
        .find()
        .then(lastEvents => {
          vm.suggestedEvents = lastEvents.map(lastEvent => {
            const rawTime = new Date(
              new Date(lastEvent.get("time")).setDate(
                lastEvent.get("time").getDate() + lastEvent.get("recursIn")
              )
            );
            return {
              event: new AV.Object("Event")
                .set("name", lastEvent.get("name"))
                .set("client", lastEvent.get("client"))
                .set("recursIn", lastEvent.get("recursIn")),
              editing: true,
              pendingChanges: {
                date: `${rawTime.getFullYear()}-${`0${rawTime.getMonth() +
                  1}`.slice(-2)}-${`0${rawTime.getDate()}`.slice(-2)}`,
                time: `${`0${rawTime.getHours()}`.slice(
                  -2
                )}:${`0${rawTime.getMinutes()}`.slice(-2)}`
              },
              lastEvent
            };
          });
        })
        .catch(error => {
          alert(error);
        });
      AV.Query.or(innerClientQuery, innerCompanyQuery)
        .notEqualTo("time", null)
        .equalTo("done", true)
        .include("client")
        .limit(1000)
        .find()
        .then(pastEvents => {
          vm.pastEvents = pastEvents.map(event => ({
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
    add(event) {
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
      event.lastEvent.unset("recursIn");
      AV.Object.saveAll([event.event, event.lastEvent])
        .then(vm.fetchEvents)
        .catch(error => {
          alert(error);
        });
    },
    createEvent(newEvent) {
      const vm = this;
      const client = AV.Object.createWithoutData("Client", vm.$route.params.id);
      const event = new AV.Object("Event");
      event
        .set("client", client)
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
        )
        .set("notes",newEvent.notes);
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

<style scoped>
#createButton {
    margin-bottom: 0;
}
#eventLists {
    float: left;
}
</style>
