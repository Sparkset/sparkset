<template>
  <div>
    <div class="column column--right">
      <div class="card">
        <section class="fields">
          <h1>Suggestions</h1>
          <p v-if="suggestedEvents.length">
            {{ suggestedEvents.length }}
            {{ suggestedEvents.length === 1 ? "event" : "events" }} can be
            scheduled.
          </p>
          <p v-else>You are all caught up!</p>
        </section>
        <section
          v-for="event in suggestedEvents"
          :key="event.lastEvent.id"
          class="fields"
        >
          <p>
            {{ event.event.get("name") }} with
            {{ event.event.get("client").get("fullName") }}
          </p>
          <form @submit.prevent="add(event)">
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
                Add
              </button>
            </div>
          </form>
        </section>
      </div>
    </div>
    <div class="column column--left">
      <div class="card">
        <section class="fields">
          <h1>Upcoming</h1>
          <div class="field field--superwide">
            <EventsTable
              :events="upcomingEvents"
              show-client
              :fetch-events="fetchEvents"
            />
          </div>
        </section>
      </div>
    </div>
  </div>
</template>

<script>
import EventsTable from "@/components/EventsTable.vue";
import AV from "leancloud-storage";
export default {
  name: "OverviewPage",
  components: {
    EventsTable
  },
  data() {
    return {
      upcomingEvents: [],
      suggestedEvents: []
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
        .equalTo("done", true)
        .exists("recursIn")
        .include("client")
        .ascending("time")
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
    }
  }
};
</script>

<style scoped></style>
