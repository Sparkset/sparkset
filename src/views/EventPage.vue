<template>
  <div>
    <!--Back Button-->
      <div id="top">
          <div v-if="!editing" class="field" id="back">
              <button class="primary" @click="back">Back to Events</button>
          </div>
      </div>
    <!--start original form-->
    <div class="column">
      <div class="card">
        <section class="fields">
          <h1>
            {{ event.get("name") }}
            <font-awesome-icon
              v-if="event.get('company')"
              :icon="['fas', 'building']"
            />{{" "}}
            <template v-if="!editing" class="field">
              <button id="statusButton" class="primary" @click="toggle">
                {{ event.get("done") ? "Undone" : "Done" }}
              </button>
            </template>
          </h1>
            <form v-if="editing" @submit.prevent="save">
              <div class="field">
                <textarea v-model="pendingChanges.name"/>
              </div>
            </form>
        </section>
        <section class="fields">
          <h2>Details</h2>
          <div class="field">
            <ul>
              <li>
                <a v-if="!editing" @click="editing = true">
                  Start Time:
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
                <form v-else @submit.prevent="save">
                  <p>New Start Time</p>
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
                </form>
              </li>
            <li>
                <a v-if="!editing" @click="editing = true">
                  End Time:
                  {{ 
                    event.get("time")
                      ? event.get("time").toLocaleString("en-US", {year: "numeric", month: "numeric", day: "numeric"})
                      : undefined
                  }}
                  {{
                    event.get("endTime")
                      ? event.get("endTime").toLocaleString("en-US", {hour: "numeric", minute: "numeric" })
                      : undefined
                  }} 
                </a>
                <form v-else @submit.prevent="save">
                  <p>New End Time</p>
                  <div class="field">
                    <input
                      type="date"
                      max="2099-12-31"
                      v-model="pendingChanges.date"
                      required
                    />
                  </div>
                  <div class="field">
                    <input type="time" v-model="pendingChanges.endTime" required />
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
          </h2>
          <div v-if="event.get('notes') && !editing" class="field">
            <vue-markdown>
              {{ event.get("notes") }}
            </vue-markdown>
          </div>
          <form v-if="editing" @submit.prevent="save">
            <div class="field">
              <textarea v-model="pendingChanges.notes" />
            </div>
            <div v-if="editing" class="field">
              <button type="submit" class="primary">Save</button>
              <button type="button" @click="(editing = false)">
                Cancel
              </button>
            </div> 
          </form>
          <div v-if="!editing" class="field">
            <button id="deleteEvent" class="primary" @click="deleteE">
              Delete
            </button>
            <button id="editButton" class="primary" @click="editing = true">
              Edit
            </button>
          </div>
        </section>
      </div>
    </div>
  </div>
</template>

<script>
import AV from "leancloud-storage";
import VueMarkdown from "vue-markdown";
import {getEmail, signIn} from "../services/auth"; 
import {updateEvent, deleteEvent} from "../services/graph";
export default {
  name: "EventPage",
  components: {
    VueMarkdown
  },
  data() {
    return {
      event: new AV.Object("Event"),
      client: new AV.Object("Client"),
      clientRoute: "6093265e9b9be32e4a492af4",//right now this is Alexa Anteater's id. we need to get this as a param.
      routerLink: "/client/6093265e9b9be32e4a492af4/preferences",//for back button
      editing:false,
      pendingChanges: {
        date: "",
        time: "",
        endTime: "",
        notes: "",
        name: "",
      },
      calendarEmail: false,
      clientName: ""
      //eventSyncing: true 
      // would be automatically t/f based on settings, not doing this rn tho
    };
  },
  created() {
    const vm = this;
    vm.calendarEmail = getEmail();
    const eventQuery = new AV.Query("Event");
    eventQuery            
      .notEqualTo("time", null)
      .include("client")
      .include("company")
      .get(vm.$route.params.id)
      .then(event => {
        vm.event = event;
        vm.clientName = event.get("client").get("fullName");
        vm.pendingChanges.date = `${event
          .get("time")
          .getFullYear()}-${`0${event.get("time").getMonth() + 1}`.slice(
          -2
        )}-${`0${event.get("time").getDate()}`.slice(-2)}`;
        vm.pendingChanges.time = `${`0${event.get("time").getHours()}`.slice(
          -2
        )}:${`0${event.get("time").getMinutes()}`.slice(-2)}`;
        vm.pendingChanges.endTime = `${`0${event.get("endTime").getHours()}`.slice(
          -2
        )}:${`0${event.get("endTime").getMinutes()}`.slice(-2)}`;
        vm.pendingChanges.notes = event.get("notes");
        vm.pendingChanges.name = event.get("name");
      })
      .catch(error => {
        alert(error);
      });
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
    save(){
      const vm = this;
      vm.event
      .set("name",vm.pendingChanges.name)
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
      .set(
          "endTime",
          new Date(
            vm.pendingChanges.date.slice(0, 4),
            vm.pendingChanges.date.slice(5, 7) - 1,
            vm.pendingChanges.date.slice(8, 10),
            vm.pendingChanges.endTime.slice(0, 2),
            vm.pendingChanges.endTime.slice(3, 5),
            0
          )
        )
      .set("notes",vm.pendingChanges.notes)
      .save()
      .then(() => {
        vm.editing = false;
      })
      .catch(error => {
        alert(error);
      });
      if (vm.calendarEmail) { //if signed in, do a sync delete
        const eventName = vm.clientName + " - " + vm.pendingChanges.name;
        updateEvent(vm.event.get('syncId'), eventName, vm.pendingChanges.date, vm.pendingChanges.time, vm.pendingChanges.endTime, vm.pendingChanges.notes);
      }
    }, 
    async deleteE() { //here
      const vm = this;
      if (confirm(`Are you sure you want to delete the event?`)) {
        if (vm.calendarEmail) { //if signed in, do a sync delete
          await vm.syncDelete(); //sometimes this fails
        }
        await vm.event                
          .destroy()
          .catch(error => {
            alert(error);
          }); 
      }
      window.location.replace("/client/" + vm.event.get("client").get("objectId") + "/events"); 

    },
    async syncDelete() {
      // if (vm.calendarEmail == false) {       //only needed if they want to be reminded to sign in
      //   const response = await signIn();
      //   vm.calendarEmail = response;
      // }
      //here is where the magic happens
      const vm = this;
      if (vm.calendarEmail == false) {
        //log in first 
        const response = await signIn();
        vm.calendarEmail = response;
      }
      const id = vm.event.get('syncId');
      if (id) {
        await deleteEvent(id);
      }
    },
    back() {
      const vm = this;
      window.location.replace("/client/" + vm.event.get("client").get("objectId") + "/events");
    }
  } 
}
</script>

<style scoped>
h1 > svg {
  color: #605e5e;
}

#statusButton {
  float: right;
  margin-bottom: 8px;
}

#editButton {
  float: right;
  margin-right: 16px;
}
#deleteEvent {
  border-color: #e52f2e;
  background-color: #e52f2e;
  float: right;
}

#top {
  margin-top: 25px
}
.column {
  margin-top: 25px
}
#back {
  margin: 0
}
</style>

