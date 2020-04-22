<template>
  <section class="fields">
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
    <div class="field">
      <button
        class="primary"
        v-if="!createCustomEvent"
        @click="createCustomEvent = true"
      >
        Create Custom Event
      </button>
    </div>
    <form v-if="createCustomEvent" @submit.prevent="createEvent">
      <h3>Event Name</h3>
      <input type="text" v-model="newEvent.name" required />
      <h3>Event Date</h3>
      <input type="date" v-model="newEvent.date" required />
      <h3>Event Time</h3>
      <input type="time" v-model="newEvent.time" required />
      <br />
      <div class="field field--half" style="padding-top: 20px;">
        <toggle-button
          :value="newEvent.recurringEvent"
          :color="{
            checked: '#36d5d8',
            unchecked: '#e52f2e'
          }"
          :labels="{
            checked: 'Recurring Event',
            unchecked: 'Single Event'
          }"
          :width="150"
          :height="35"
          :font-size="12"
          @change="changeUserCreationPermission"
          sync
        />
      </div>
      <br />
      <div v-if="newEvent.recurringEvent" style="padding-top: 50px;">
        <h3>Days Between Events</h3>
        <input
          type="number"
          min="1"
          v-model.number="newEvent.daysBetween"
          required
        />
      </div>
      <div class="field" style="padding-top: 10px;">
        <button class="primary">
          Save
        </button>
      </div>
      <div class="field" style="padding-top: 10px;">
        <button @click="cancel">Cancel</button>
      </div>
    </form>
  </section>
</template>

<script>
import EventsTable from "@/components/EventsTable.vue";
import AV from "leancloud-storage";
export default {
  name: "ClientEvents",
  components: {
    EventsTable
  },
  data() {
    return {
      upcomingEvents: [],
      suggestedEvents: [],
      pastEvents: [],
      createCustomEvent: false,
      newEvent: {
        name: "",
        date: "",
        time: "",
        recurringEvent: false,
        daysBetween: 0
      }
    };
  },
  created() {
    const vm = this;
    vm.fetchEvents();
  },
  methods: {
    fetchEvents() {
      const vm = this;
      const upcomingEventQuery = new AV.Query("Event");
      upcomingEventQuery
        .equalTo(
          "client",
          AV.Object.createWithoutData("Client", vm.$route.params.id)
        )
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
      const lastEventQuery = new AV.Query("Event");
      lastEventQuery
        .equalTo(
          "client",
          AV.Object.createWithoutData("Client", vm.$route.params.id)
        )
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
      const pastEventQuery = new AV.Query("Event");
      pastEventQuery
        .equalTo(
          "client",
          AV.Object.createWithoutData("Client", vm.$route.params.id)
        )
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
    createEvent() {
      const vm = this;
      console.log(vm.newEvent.date);
      var ne = new AV.Object("Event");
      ne.set("done", false);
      ne.set("name", vm.newEvent.name);
      ne.set(
        "time",
        new Date(
          vm.newEvent.date.slice(0, 4),
          vm.newEvent.date.slice(5, 7) - 1,
          vm.newEvent.date.slice(8, 10),
          vm.newEvent.time.slice(0, 2),
          vm.newEvent.time.slice(3, 5),
          0
        )
      );
      var clientPointer = AV.Object.createWithoutData(
        "Client",
        vm.$route.params.id
      );
      ne.set("client", clientPointer);
      if (vm.newEvent.recurringEvent == true) {
        ne.set("recursIn", vm.newEvent.daysBetween);
        console.log(vm.newEvent.daysBetween);
      }
      ne.save().then(
        function(event) {
          alert("New Event has been saved: " + event.id);
          vm.resetNewEventValues();
          vm.createCustomEvent = false;
        },
        function(error) {
          alert(error);
        }
      );
    },
    changeUserCreationPermission(e) {
      const vm = this;
      vm.newEvent.recurringEvent = e.value;
    },
    cancel() {
      const vm = this;
      vm.resetNewEventValues();
    },
    resetNewEventValues() {
      const vm = this;
      vm.createCustomEvent = false;
      vm.newEvent.name = "";
      vm.newEvent.date = "";
      vm.newEvent.time = "";
      vm.newEvent.recurringEvent = false;
    }
  }
};
</script>

<style scoped></style>
