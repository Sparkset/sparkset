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
          :key="event.event.id"
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
                v-model="event.nextTime.date"
                required
              />
            </div>
            <div class="field">
              <input type="time" v-model="event.nextTime.time" required />
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
          <div class="field">
            <table>
              <thead>
                <tr>
                  <th class="sortable" @click="sortBy('client')">
                    Client
                    <span v-if="sortedBy === 'client'">
                      <font-awesome-icon
                        :icon="[
                          'fas',
                          sortOrder === 1
                            ? 'long-arrow-alt-up'
                            : 'long-arrow-alt-down'
                        ]"
                      />
                    </span>
                  </th>
                  <th class="sortable" @click="sortBy('name')">
                    Event
                    <span v-if="sortedBy === 'name'">
                      <font-awesome-icon
                        :icon="[
                          'fas',
                          sortOrder === 1
                            ? 'long-arrow-alt-up'
                            : 'long-arrow-alt-down'
                        ]"
                      />
                    </span>
                  </th>
                  <th class="sortable" @click="sortBy('time')">
                    Time
                    <span v-if="sortedBy === 'time'">
                      <font-awesome-icon
                        :icon="[
                          'fas',
                          sortOrder === 1
                            ? 'long-arrow-alt-up'
                            : 'long-arrow-alt-down'
                        ]"
                      />
                    </span>
                  </th>
                  <th>Done</th>
                </tr>
              </thead>
              <tbody>
                <tr v-for="event in sortedUpcomingEvents" :key="event.event.id">
                  <td>
                    <span class="picture-name-combo">
                      <img
                        :src="
                          event.event.get('client').get('picture')
                            ? event.event
                                .get('client')
                                .get('picture')
                                .url()
                            : 'https://www.gravatar.com/avatar/00000000000000000000000000000000?d=mp&f=y'
                        "
                      />
                      <span>
                        <span>
                          <router-link
                            :to="`/client/${event.event.get('client').id}`"
                          >
                            {{ event.event.get("client").get("fullName") }}
                          </router-link>
                          <a
                            v-if="event.event.get('client').get('linkedin')"
                            :href="
                              `https://www.linkedin.com/in/${event.event
                                .get('client')
                                .get('linkedin')}`
                            "
                            target="_blank"
                          >
                            <font-awesome-icon :icon="['fab', 'linkedin']" />
                          </a>
                        </span>
                        <br />
                        <span class="nickname">
                          {{ event.event.get("client").get("nickname") }}
                        </span>
                      </span>
                    </span>
                  </td>
                  <td>{{ event.event.get("name") }}</td>
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
                        <input
                          type="time"
                          v-model="event.pendingChanges.time"
                          required
                        />
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
                    <button class="primary" @click="done(event)">
                      Done
                    </button>
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
        </section>
      </div>
    </div>
  </div>
</template>

<script>
import AV from "leancloud-storage";
export default {
  name: "OverviewPage",
  data() {
    return {
      upcomingEvents: [],
      suggestedEvents: [],
      sortedBy: "time",
      sortOrder: 1
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
      const suggestedEventQuery = new AV.Query("Event");
      suggestedEventQuery
        .equalTo("done", true)
        .exists("recursIn")
        .include("client")
        .ascending("time")
        .limit(1000)
        .find()
        .then(suggestedEvents => {
          vm.suggestedEvents = suggestedEvents.map(event => {
            const rawNextTime = new Date(
              event
                .get("time")
                .setDate(event.get("time").getDate() + event.get("recursIn"))
            );
            return {
              event,
              nextTime: {
                date: `${rawNextTime.getFullYear()}-${`0${rawNextTime.getMonth() +
                  1}`.slice(-2)}-${`0${rawNextTime.getDate()}`.slice(-2)}`,
                time: `${`0${rawNextTime.getHours()}`.slice(
                  -2
                )}:${`0${rawNextTime.getMinutes()}`.slice(-2)}`
              }
            };
          });
        })
        .catch(error => {
          alert(error);
        });
    },
    add(lastEvent) {
      const vm = this;
      const event = new AV.Object("Event");
      event
        .set("name", lastEvent.event.get("name"))
        .set("client", lastEvent.event.get("client"))
        .set("recursIn", lastEvent.event.get("recursIn"))
        .set(
          "time",
          new Date(
            lastEvent.nextTime.date.slice(0, 4),
            lastEvent.nextTime.date.slice(5, 7) - 1,
            lastEvent.nextTime.date.slice(8, 10),
            lastEvent.nextTime.time.slice(0, 2),
            lastEvent.nextTime.time.slice(3, 5),
            0
          )
        );
      lastEvent.event.unset("recursIn");
      AV.Object.saveAll([event, lastEvent.event])
        .then(vm.fetchEvents)
        .catch(error => {
          alert(error);
        });
    },
    sortBy(field) {
      const vm = this;
      vm.sortOrder = vm.sortedBy === field ? -vm.sortOrder : 1;
      vm.sortedBy = field;
    },
    update(event) {
      event.event
        .set(
          "time",
          new Date(
            event.pendingChanges.date.slice(0, 4),
            event.pendingChanges.date.slice(5, 7) - 1,
            event.pendingChanges.date.slice(8, 10),
            event.pendingChanges.time.slice(0, 2),
            event.pendingChanges.time.slice(3, 5),
            0
          )
        )
        .save()
        .then(() => {
          event.editing = false;
        })
        .catch(error => {
          alert(error);
        });
    },
    done(event) {
      const vm = this;
      event.event
        .set("done", true)
        .save()
        .then(vm.fetchEvents)
        .catch(error => {
          alert(error);
        });
    }
  },
  computed: {
    sortedUpcomingEvents() {
      const vm = this;
      return vm.upcomingEvents.sort((a, b) =>
        a.event.get(vm.sortedBy) > b.event.get(vm.sortedBy)
          ? vm.sortOrder
          : -vm.sortOrder
      );
    }
  }
};
</script>

<style scoped>
.picture-name-combo {
  display: flex;
  align-items: center;
}
.picture-name-combo > img {
  margin: 0 1rem 0 0;
  border-radius: 50%;
  width: 30pt;
  height: 30pt;
  object-fit: cover;
}
.nickname {
  font-size: 9pt;
  opacity: 0.6;
}
</style>
