<template>
  <div>
    <div class="column">
      <div class="card ">
        <section class="fields title">
          <h1>{{ event.get("name") }}</h1>
          <button class="primary" @click="toggle(event)">
            {{ event.get("done") == true ? "Undone" : "Done" }}
          </button>
        </section>
        <section class="fields">
          <h2>Details</h2>
          <ul>
            <li>
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
            </li>
            <li v-if="event.get('client')">Client: {{ clientName }}</li>
            <li>Company: {{ companyName }}</li>
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
      companyName: ""
    };
  },
  methods: {
    getClientName(id) {
      const vm = this;
      console.log(id);
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
