<template>
  <div>
    <div class="column">
      <div class="card">
        <section class="fields">
          <h1>
            {{ event.get("name") }}
            <font-awesome-icon
              v-if="event.get('company')"
              :icon="['fas', 'building']"
            />{{ " " }}
            <button class="primary" @click="toggle">
              {{ event.get("done") ? "Undone" : "Done" }}
            </button>
          </h1>
        </section>
        <section class="fields">
          <h2>Details</h2>
          <div class="field">
            <ul>
              <li>
                <a v-if="!editingTime" @click="editingTime = true">
                  Time:
                  {{
                    event.get("time")
                      ? event.get("time").toLocaleString("en-US", {
                          year: "numeric",
                          month: "numeric",
                          day: "numeric",
                          hour: "numeric",
                          minute: "numeric"
                        })
                      : undefined
                  }}
                </a>
                <form v-else @submit.prevent="updateTime">
                  <p>New Time</p>
                  <div class="field">
                    <input
                      type="date"
                      max="2099-12-31"
                      v-model="pendingChanges.date"
                      required
                    />
                  </div>
                  <div class="field">
                    <input type="time" v-model="pendingChanges.time" required />
                  </div>
                  <div class="field">
                    <button type="submit" class="primary">
                      Save
                    </button>
                  </div>
                </form>
              </li>
              <li v-if="event.get('client')">
                <router-link :to="`/client/${event.get('client').id}`">
                  Client: {{ event.get("client").get("fullName") }}
                </router-link>
              </li>
              <li v-if="event.get('company')">
                <router-link :to="`/company/${event.get('company').id}`">
                  Company: {{ event.get("company").get("name") }}
                </router-link>
              </li>
            </ul>
          </div>
        </section>
        <section class="fields">
          <h2>
            Notes
            <button
              class="primary"
              v-if="!editingNotes"
              @click="editingNotes = true"
            >
              Edit
            </button>
          </h2>
          <div v-if="event.get('notes') && !editingNotes" class="field">
            <vue-markdown>
              {{ event.get("notes") }}
            </vue-markdown>
          </div>
          <form v-else @submit.prevent="saveNotes">
            <div class="field">
              <textarea v-model="pendingChanges.notes" />
            </div>
            <div class="field">
              <button class="primary">
                Save
              </button>
            </div>
          </form>
        </section>
      </div>
    </div>
  </div>
</template>

<script>
import AV from "leancloud-storage";
import VueMarkdown from "vue-markdown";
export default {
  name: "EventPage",
  components: {
    VueMarkdown
  },
  data() {
    return {
      event: new AV.Object("Event"),
      editingTime: false,
      editingNotes: false,
      pendingChanges: {
        date: "",
        time: "",
        notes: ""
      }
    };
  },
  methods: {
    toggle() {
      const vm = this;
      vm.event
        .set("done", !vm.event.get("done"))
        .save()
        .catch(error => {
          alert(error);
        });
    },
    updateTime() {
      const vm = this;
      vm.event
        .set(
          "time",
          new Date(
            vm.pendingChanges.date.slice(0, 4),
            vm.pendingChanges.date.slice(5, 7) - 1,
            vm.pendingChanges.date.slice(8, 10),
            vm.pendingChanges.time.slice(0, 2),
            vm.pendingChanges.time.slice(3, 5),
            0
          )
        )
        .save()
        .then(() => {
          vm.editingTime = false;
        })
        .catch(error => {
          alert(error);
        });
    },
    saveNotes() {
      const vm = this;
      vm.event
        .set("notes", vm.pendingChanges.notes)
        .save()
        .then(() => {
          vm.editingNotes = false;
        })
        .catch(error => {
          alert(error);
        });
    }
  },
  created() {
    const vm = this;
    const eventQuery = new AV.Query("Event");
    eventQuery
      .include("client")
      .include("company")
      .get(vm.$route.params.id)
      .then(event => {
        vm.event = event;
        vm.pendingChanges.date = `${event
          .get("time")
          .getFullYear()}-${`0${event.get("time").getMonth() + 1}`.slice(
          -2
        )}-${`0${event.get("time").getDate()}`.slice(-2)}`;
        vm.pendingChanges.time = `${`0${event.get("time").getHours()}`.slice(
          -2
        )}:${`0${event.get("time").getMinutes()}`.slice(-2)}`;
        vm.pendingChanges.notes = event.get("notes");
      })
      .catch(error => {
        alert(error);
      });
  }
};
</script>

<style scoped>
h1 > svg {
  color: #605e5e;
}
</style>
