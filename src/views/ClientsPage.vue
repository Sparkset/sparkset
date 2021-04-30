<template>
  <div>
      <div class="column">
          <div class="card">
              <section class="fields">
                  <h1>
                      Showing {{ clients.length }}
                      {{ clients.length === 1 || clients.length === 0? "Client" : "Clients" }}
                  </h1>
                  <div class="field field--half">
                      <label>
                          <span>Whose</span>
                          <select v-model="selectedField" @change="search">
                              <option v-for="(field, index) in fields"
                                      :key="field.name"
                                      :value="index">
                                  {{ field.name }}
                              </option>
                          </select>
                      </label>
                  </div>
                  <div class="field field--half">
                      <label>
                          <span>Contains</span>
                          <input type="text" v-model="query" @input="search" />
                      </label>
                  </div>
                  <div class="field">
                      <button class="primary" @click="$router.push('/clients/add')">
                          Add Client
                      </button>
                  </div>
                  <!--Clients-->
                  <h1>
                      Clients
                  </h1>
                  <div class="field field--superwide">
                      <ClientsTable :clients="clients" show-company />
                  </div>
              </section>
          </div>
          <div class="field">
              <button @click="exportPDF()">
                  Export as PDF
              </button>
          </div>
          <!--example
          <h1>Upcoming</h1>
          <div class="field field--superwide">
              <EventsTable :events="upcomingEvents" :fetch-events="fetchEvents" />
          </div>
          <h1>Suggested</h1>
          <div class="field field--superwide">
              <EventsTable :events="suggestedEvents" :fetch-events="fetchEvents" />
          </div>-->
          <!--Archived Clients-->
          <div class="card">
              <section class="fields">
                  <h1>
                      Archived Clients
                  </h1>
                  <div class="field field--superwide">
                      <ClientsTable :clients="archived_clients" show-company />
                  </div>
              </section>
          </div>
      </div>
  </div>
</template>

<script>
import ClientsTable from "@/components/ClientsTable.vue";
import AV from "leancloud-storage";
import jsPDF from "jspdf";
import "jspdf-autotable";
export default {
  name: "ClientsPage",
  components: {
    ClientsTable
  },
  data() {
    return {
      fields: [
        {
          class: "Client",
          key: "fullName",
          name: "Name"
        },
        {
          class: "Client",
          key: "nickname",
          name: "Nickname"
        },
        {
          class: "Company",
          key: "name",
          name: "Company"
        },
        {
          class: "Client",
          key: "jobTitle",
          name: "Job Title"
        },
        {
          class: "Client",
          key: "jobDescription",
          name: "Job Description"
        },
        {
          class: "Client",
          key: "workPhone",
          name: "Work Phone"
        },
        {
          class: "Client",
          key: "cellPhone",
          name: "Cell Phone"
        },
        {
          class: "Client",
          key: "email",
          name: "Email"
        },
        {
          class: "Client",
          key: "address",
          name: "Address"
        },
        {
          class: "Client",
          key: "linkedin",
          name: "LinkedIn ID"
        },
        {
          class: "Revision",
          key: "favoriteSnacks",
          name: "Favorite Snack"
        },
        {
          class: "Revision",
          key: "favoriteDrinks",
          name: "Favorite Drink"
        },
        {
          class: "Revision",
          key: "allergies",
          name: "Allergy"
        },
        {
          class: "Revision",
          key: "favoriteCasualRestaurants",
          name: "Favorite Casual Restaurant"
        },
        {
          class: "Revision",
          key: "favoriteUpscaleRestaurants",
          name: "Favorite Upscale Restaurant"
        },
        {
          class: "Revision",
          key: "careerAmbitions",
          name: "Career Ambition"
        },
        {
          class: "Revision",
          key: "mentors",
          name: "Mentor"
        },
        {
          class: "Revision",
          key: "milestones",
          name: "Milestone"
        },
        {
          class: "Revision",
          key: "pets",
          name: "Pet"
        },
        {
          class: "Revision",
          key: "hobbies",
          name: "Hobby"
        },
        {
          class: "Revision",
          key: "collegeOrSportAffiliations",
          name: "College/Sport Affiliation"
        },
        {
          class: "Revision",
          key: "businessHeroes",
          name: "Business Hero"
        },
        {
          class: "Revision",
          key: "personalHeroes",
          name: "Personal Hero"
        },
        {
          class: "Revision",
          key: "businessAchievements",
          name: "Business Achievement"
        },
        {
          class: "Revision",
          key: "personalAchievements",
          name: "Personal Achievement"
        },
        {
          class: "Revision",
          key: "conferences",
          name: "Conference"
        },
        {
          class: "Revision",
          key: "books",
          name: "Book"
        },
        {
          class: "Revision",
          key: "onlineCourses",
          name: "Online Course"
        },
        {
          class: "Revision",
          key: "blogs",
          name: "Blog"
        },
        {
          class: "Revision",
          key: "petPeeves",
          name: "Pet Peeve"
        },
        {
          class: "Revision",
          key: "notes",
          name: "Notes"
        },
        {
          class: "Client",
          key: "archived",
          name: "Archived"
        }
      ],
      selectedField: 0,
      query: "",
      clients: [],
      archived_clients: []
    };
  },
  created() {
    const vm = this;
      vm.search();
      //vm.fetchClients();
  },
  methods: {
    exportPDF() {
      const vm = this;
      const rows = vm.clients.map(row => ({
        fullName: row.get("fullName"),
        company: row.get("company").get("name"),
        jobTitle: row.get("jobTitle"),
        email: row.get("email"),
        cellPhone: row.get("cellPhone")
      }));
      const columns = [
        { title: "Name", key: "fullName" },
        { title: "Company", key: "company" },
        { title: "Job Title", key: "jobTitle" },
        { title: "Email", key: "email" },
        { title: "Cell Phone", key: "cellPhone" }
      ];
      var doc = new jsPDF("p", "pt");
      doc.text("Client Information", 40, 40);
      doc.autoTable(columns, rows, {
        margin: { top: 60 },
        headerStyles: { fillColor: [54, 213, 216] }
      });
      doc.save("clients.pdf");
    },
    fetchClients() {
        /*const vm = this;
        const innerClientQuery = new AV.Query("Client");
        innerClientQuery.equalTo(
            "client",
            AV.Object.createWithoutData("Client", vm.$route.params.id)
        );
        const innerCompanyQuery = new AV.Query("Event");
        innerCompanyQuery.equalTo("company", vm.company);
        AV.Query.or(innerClientQuery, innerCompanyQuery)
            .notEqualTo("time", null)
            .equalTo("archived", false)
            .include("client")
            .limit(1000)
            .find()
            .then(clients => {
                vm.clients = clients.map(client => ({
                    name,
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
        AV.Query.or(innerClientQuery, innerCompanyQuery)
            .notEqualTo("time", null)
            .equalTo("done", true)
            .exists("recursIn")
            .include("client")
            .limit(1000)
            .find()
            .then(clients => {
                vm.archived_clients = archived_clients.map(clients => {
                    const rawTime = new Date(
                        new Date(lastEvent.get("time")).setDate(
                            lastEvent.get("time").getDate() + lastEvent.get("recursIn")
                        )
                    );
                    return {
                        event: new AV.Object("Client")
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
            });*/
    },
    search() {
      const vm = this;
      if (vm.fields[vm.selectedField].class === "Client") {
        const clientQuery = new AV.Query("Client");
        clientQuery
          .contains(vm.fields[vm.selectedField].key, vm.query)
          .matches(vm.fields[vm.selectedField].key,new RegExp(vm.query, "i"))
          .include("company")
          .limit(1000)
          .find()
          .then(clients => {
            vm.clients = clients;
          })
          .catch(error => {
            alert(error);
          });
      } else if (vm.fields[vm.selectedField].class === "Company") {
        const companyQuery = new AV.Query("Company");
        companyQuery
          .contains(vm.fields[vm.selectedField].key, vm.query)
          .matches(vm.fields[vm.selectedField].key,new RegExp(vm.query, "i"));
        const clientQuery = new AV.Query("Client");
        clientQuery
          .matchesQuery("company", companyQuery)
          .include("company")
          .limit(1000)
          .find()
          .then(clients => {
            vm.clients = clients;
          })
          .catch(error => {
            alert(error);
          });
      } else if (vm.fields[vm.selectedField].class === "Revision") {
        const revisionQuery = new AV.Query("Revision");
        revisionQuery
          .contains(vm.fields[vm.selectedField].key, vm.query)
          .matches(vm.fields[vm.selectedField].key,new RegExp(vm.query, "i"))
          .equalTo("isLatest", true)
          .include("client")
          .include("client.company")
          .limit(1000)
          .find()
          .then(revisions => {
            vm.clients = revisions.map(revision => revision.get("client"));
          })
          .catch(error => {
            alert(error);
          });
      }
    }
  }
};
</script>

<style scoped></style>
