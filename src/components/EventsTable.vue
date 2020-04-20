<template>
  <table>
    <thead>
      <tr>
        <th v-if="showClient" class="sortable" @click="sortBy('client')">
          Client
          <span v-if="sortedBy === 'client'">
            <font-awesome-icon
              :icon="[
                'fas',
                sortOrder === 1 ? 'long-arrow-alt-up' : 'long-arrow-alt-down'
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
                sortOrder === 1 ? 'long-arrow-alt-up' : 'long-arrow-alt-down'
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
                sortOrder === 1 ? 'long-arrow-alt-up' : 'long-arrow-alt-down'
              ]"
            />
          </span>
        </th>
        <th>Option</th>
      </tr>
    </thead>
    <tbody>
      <tr v-for="event in sortedEvents" :key="event.event.id">
        <td v-if="showClient">
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
                <router-link :to="`/client/${event.event.get('client').id}`">
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
import AV from "leancloud-storage";
export default {
  name: "EventsTable",
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
