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

    <div class="column ">
      <div class="card">
        <h1 style="margin-left: 25px;">Recent Notes</h1>
        <section class="fieldsModified">
          <div class="cardModified" v-for="note in recentNotes" :key="note.id">
            <NoteCard :note="note" :homePage="true"></NoteCard>
          </div>
        </section>
      </div>
    </div>
  </div>
</template>

<script>
import EventsTable from "@/components/EventsTable.vue";
import NoteCard from "@/components/NoteCard.vue";
import AV from "leancloud-storage";
export default {
  name: "OverviewPage",
  components: {
    EventsTable,
    NoteCard
  },
  data() {
    return {
      upcomingEvents: [],
      suggestedEvents: [],
      recentNotes: [],
      clients: []
    };
  },
  created() {
    const vm = this;
    vm.fetchEvents();
    vm.fetchNotes();
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
    fetchNotes() {
      const vm = this;
      const notesQuery = new AV.Query("Note");
      const currentUser = AV.User.current();
      notesQuery
        .equalTo("owner", currentUser)
        .include("clients")
        .descending("createdAt")
        .limit(4)
        .find()
        .then(function(notes) {
          vm.recentNotes = notes;
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

<style scoped>
.cardModified {
  display: flex;
  position: relative;
  float: left;
  margin: 0 0 12px 0;
  width: 250px;
  margin-left: 10px;
  margin-right: 10px;
  background-color: #fff;
  color: #605e5e;
  border: 1px solid #e5e5e5;
  border-radius: 4px;
  display: table-cell;
}

.fieldsModified {
  display: flex;
  margin-left: 10px;
  width: 100%;
  padding-top: 10px;
  overflow-x: scroll;
}
</style>
