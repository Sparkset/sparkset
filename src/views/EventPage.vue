<template>
  <div>
    <div class="column">
      <div class="card ">
        <section class="field fields title">
          <h1>{{ event.get("name") }}</h1>
          <button
            class="primary"
            @click="toggle(event)"
            style="margin-left: 10px;"
          >
            {{ event.get("done") == true ? "Undone" : "Done" }}
          </button>
        </section>
        <section class="field fields">
          <h2>Details</h2>
          <ul>
            <li v-if="!editingTime">
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
              <button
                class="primary"
                v-if="!editingTime"
                @click="editingTime = true"
                style="margin-left: 10px;"
              >
                Edit Time
              </button>
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
            <li v-if="event.get('client')">Client: {{ clientName }}</li>
            <li>Client Company: {{ companyName }}</li>
          </ul>
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
      event: null,
      clientName: "",
      companyName: "",
      editingTime: false,
      pendingChanges: {
        date: "",
        time: ""
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
      // if (event.lastEvent) {
      //   event.lastEvent.unset("recursIn");
      //   AV.Object.saveAll([event.event, event.lastEvent])
      //     .then(vm.fetchEvents)
      //     .catch((error) => {
      //       alert(error);
      //     });
      // } else {
      //   event.event
      //     .save()
      //     .then(() => {
      //       event.editing = false;
      //     })
      //     .catch((error) => {
      //       alert(error);
      //     });
      // }
    }
  },
  created() {
    const vm = this;
    const eventQuery = new AV.Query("Event");
    const eventId = vm.$route.params.id;
    eventQuery
      .get(eventId)
      .then(event => {
        vm.event = event;
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
  margin-left: 925px;
  background-color: #36d5d8;
  color: #fff;
  padding-left: 10px;
  padding-right: 10px;
}
</style>
