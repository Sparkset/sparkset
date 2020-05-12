<template>
  <div>
    <div class="column">
      <div class="card ">
        <section class="field fields title">
          <h1>{{ event.get("name") }}</h1>
          <font-awesome-icon
            v-if="event.get('company')"
            :icon="['fas', 'building']"
            size="lg"
            style="margin-top: 13px; margin-left: 10px;"
          />
          <button
            class="primary"
            @click="toggle(event)"
            style="margin-left: 30px;"
          >
            {{ event.get("done") == true ? "Undone" : "Done" }}
          </button>
        </section>
        <section class="field fields">
          <h2>Details</h2>
          <ul>
            <li v-if="!editingTime && event.get('time')">
              <a @click="editingTime = true">
                Time:
                {{
                  event.get("time").toLocaleString("en-US", {
                    year: "numeric",
                    month: "numeric",
                    day: "numeric",
                    hour: "numeric",
                    minute: "numeric"
                  })
                }}
              </a>
            </li>

            <form v-if="editingTime" @submit.prevent="update(event)">
              <h3>New Time</h3>
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
            <router-link
              v-if="event.get('client')"
              :to="`/client/${event.get('client').id}`"
            >
              <li v-if="event.get('client')">Client: {{ clientName }}</li>
            </router-link>
            <router-link
              v-if="event.get('company')"
              :to="`/company/${event.get('company').id}`"
            >
              <li>Client Company: {{ companyName }}</li>
            </router-link>
          </ul>
        </section>
        <section class="fields">
          <div class="notesTitle">
            <h2>Notes</h2>
            <button
              class="primary"
              v-if="!editingNotes"
              @click="editingNotes = true"
              style="margin-left: 10px; margin-bottom: 10px;"
            >
              Edit Notes
            </button>
          </div>
          <div style="margin-top: 5px;">
            <div v-if="!editingNotes" style="display: flex;">
              <p v-if="!editingNotes">{{ event.get("notes") }}</p>
            </div>
            <div v-if="editingNotes">
              <textarea v-model="pendingChanges.notes"> </textarea>
              <button class="primary" @click="saveNote(event)">
                Save Note
              </button>
            </div>
          </div>
        </section>
      </div>
    </div>
  </div>
</template>

<script>
import AV from "leancloud-storage";
export default {
  name: "EventPage",
  data() {
    return {
      event: new AV.Object("Event"),
      clientName: "",
      companyName: "",
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
    getClientName(id) {
      const vm = this;
      const clientQuery = new AV.Query("Client");
      clientQuery
        .get(id)
        .then(client => {
          vm.clientName = client.get("fullName");
          vm.getCompanyName(client.get("company").get("objectId"));
        })
        .catch(error => {
          alert(error);
        });
    },
    getCompanyName(id) {
      const vm = this;
      const companyQuery = new AV.Query("Company");
      companyQuery
        .get(id)
        .then(company => {
          vm.companyName = company.get("name");
        })
        .catch(error => {
          alert(error);
        });
    },
    toggle(event) {
      const vm = this;
      event
        .set("done", !event.get("done"))
        .save()
        .then(vm.created)
        .catch(error => {
          alert(error);
        });
    },
    update(event) {
      const vm = this;
      event.set(
        "time",
        new Date(
          vm.pendingChanges.date.slice(0, 4),
          vm.pendingChanges.date.slice(5, 7) - 1,
          vm.pendingChanges.date.slice(8, 10),
          vm.pendingChanges.time.slice(0, 2),
          vm.pendingChanges.time.slice(3, 5),
          0
        )
      );
      event
        .save()
        .then(() => {
          vm.editingTime = false;
          vm.created;
        })
        .catch(error => {
          alert(error);
        });
    },
    resetPendingChanges() {
      const vm = this;
      vm.pendingChanges.date = "";
      vm.pendingChanges.time = "";
      vm.pendingChanges.notes = "";
    },
    saveNote(event) {
      const vm = this;
      event
        .set("notes", vm.pendingChanges.notes)
        .save()
        .then(() => {
          vm.editingNotes = false;
          vm.created;
        })
        .catch(error => {
          alert(error);
        });
    }
  },
  created() {
    const vm = this;
    const eventQuery = new AV.Query("Event");
    vm.resetPendingChanges();
    const eventId = vm.$route.params.id;
    eventQuery
      .get(eventId)
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
        if (event.get("client")) {
          vm.getClientName(vm.event.get("client").get("objectId"));
        } else if (event.get("company")) {
          vm.getCompanyName(vm.event.get("company").get("objectId"));
        }
      })
      .catch(error => {
        alert(error);
      });
  }
};
</script>

<style scoped>
.title {
  display: flex;
}

.primary {
  background-color: #36d5d8;
  color: #fff;
  padding-left: 10px;
  padding-right: 10px;
}

.notesTitle {
  display: flex;
}
</style>
