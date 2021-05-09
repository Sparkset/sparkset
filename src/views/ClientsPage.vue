<template>
  <div>
      <div class="column">
          <div class="card">
              <section class="fields">
                  <div v-if="newEvent.viewArchived == false">
                      <h1>
                          Showing {{ clients.length }}
                          {{ clients.length === 1 || clients.length === 0? "Client" : "Clients" }}
                      </h1>
                  </div>
                  <div v-else>
                      <h1>
                          Showing {{ archived_clients.length }}
                          {{ archived_clients.length === 1 || archived_clients.length === 0? "Client" : "Clients" }}
                      </h1>
                  </div>
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
                  <div class="field field--half">
                      <button class="primary" @click="$router.push('/clients/add')">
                          Add Client
                      </button>
                  </div>
                  <div class="field field--half" id="archivedToggle">
                      <label>
                          <span>View Archived Clients</span>
                          <toggle-button :value="newEvent.viewArchived"
                                         :color="{
                                            checked: '#36d5d8',
                                            unchecked: '#e52f2e'
                                          }"
                                         :labels="{
                                            checked: 'Yes',
                                            unchecked: 'No'
                                          }"
                                         :width="72"
                                         :height="42"
                                         :font-size="12"
                                         @change="changeViewArchived"></toggle-button>
                      </label>
                  </div>
                  <div></div>
                  <!--Show unarchived clients if viewArchived is false-->
                  <div v-if="newEvent.viewArchived == false">
                      <h1>Clients</h1>
                      <div class="field field--superwide">
                          <ClientsTable :clients="clients" show-company :fetch-clients="fetchClients" />
                      </div>
                  </div>
                  <!--Show archived clients if viewArchived is true-->
                  <div v-else>
                      <h1>Archived Clients</h1>
                      <div class="field field--superwide">
                          <ClientsTable :clients="archived_clients" show-company :fetch-clients="fetchClients" />
                      </div>
                  </div>
              </section>
          </div>
          <div class="field">
              <button @click="exportPDF()">
                  Export as PDF
              </button>
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
        }
        ],
      newEvent: {
          viewArchived: false
      },
      selectedField: 0,
      query: "",
      clients: [],
      archived_clients: []
    };
  },
  created() {
    const vm = this;
      vm.search();
  },
  methods: {
    
    changeViewArchived(e) {
        const vm = this;
        vm.newEvent.viewArchived = e.value;
        vm.search();
      },
    search() {
        const vm = this;
        vm.searchClient();//fill clients table
        vm.searchArchivedClient();//fill archived clients tabl
        vm.fetchClients();//show results to screen
    },
    fetchClients() {
        const vm = this;
        console.log("ClientsPage fetchClients")//debugging
        //show clients table
        const clientQuery = new AV.Query("Client");
        clientQuery.equalTo('archived', false);
        clientQuery
            .contains(vm.fields[vm.selectedField].key, vm.query)
            .matches(vm.fields[vm.selectedField].key, new RegExp(vm.query, "i"))
            .equalTo("archived", false)
            .include("company")
            .limit(1000)
            .find()
            .then(clients => {
                vm.clients = clients;
            })
            .catch(error => {
                alert(error);
            });
        //show archived clients table
        const archivedClientQuery = new AV.Query("Client");
        archivedClientQuery.equalTo('archived', true);
        archivedClientQuery
            .contains(vm.fields[vm.selectedField].key, vm.query)
            .matches(vm.fields[vm.selectedField].key, new RegExp(vm.query, "i"))
            .equalTo("archived", true)
            .include("company")
            .limit(1000)
            .find()
            .then(archived_clients => {
                vm.archived_clients = archived_clients;
            })
            .catch(error => {
                alert(error);
            });
    },
    searchClient() {
        const vm = this;
        if (vm.fields[vm.selectedField].class === "Client") {
            const clientQuery = new AV.Query("Client");
            clientQuery
                .contains(vm.fields[vm.selectedField].key, vm.query)
                .matches(vm.fields[vm.selectedField].key, new RegExp(vm.query, "i"))
                .equalTo("archived", false)
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
                .matches(vm.fields[vm.selectedField].key, new RegExp(vm.query, "i"));
            const clientQuery = new AV.Query("Client");
            clientQuery
                .matchesQuery("company", companyQuery)
                .equalTo("archived", false)
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
                .matches(vm.fields[vm.selectedField].key, new RegExp(vm.query, "i"))
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
    },
    searchArchivedClient() {
      const vm = this;
      if (vm.fields[vm.selectedField].class === "Client") {
        const clientQuery = new AV.Query("Client");
        clientQuery
            .contains(vm.fields[vm.selectedField].key, vm.query)
            .matches(vm.fields[vm.selectedField].key, new RegExp(vm.query, "i"))
            .equalTo("archived", true)
            .include("company")
            .limit(1000)
            .find()
            .then(archived_clients => {
                vm.archived_clients = archived_clients;
            })
            .catch(error => {
                alert(error);
            });
        } else if (vm.fields[vm.selectedField].class === "Company") {
            const companyQuery = new AV.Query("Company");
            companyQuery
                .contains(vm.fields[vm.selectedField].key, vm.query)
                .matches(vm.fields[vm.selectedField].key, new RegExp(vm.query, "i"));
            const clientQuery = new AV.Query("Client");
            clientQuery
                .matchesQuery("company", companyQuery)
                .equalTo("archived", true)
                .include("company")
                .limit(1000)
                .find()
                .then(archived_clients => {
                    vm.archived_clients = archived_clients;
                })
                .catch(error => {
                    alert(error);
                });
        } else if (vm.fields[vm.selectedField].class === "Revision") {
            const revisionQuery = new AV.Query("Revision");
            revisionQuery
                .contains(vm.fields[vm.selectedField].key, vm.query)
                .matches(vm.fields[vm.selectedField].key, new RegExp(vm.query, "i"))
                .equalTo("isLatest", true)
                .include("client")
                .include("client.company")
                .limit(1000)
                .find()
                .then(revisions => {
                    vm.archived_clients = revisions.map(revision => revision.get("client"));
                })
                .catch(error => {
                    alert(error);
                });
        }
      },
    exportPDF() {
        const vm = this;
        var doc = new jsPDF("p", "pt");
        if (vm.newEvent.viewArchived) {
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
            doc.text("Client Information", 40, 40);
            doc.autoTable(columns, rows, {
                margin: { top: 60 },
                headerStyles: { fillColor: [54, 213, 216] }
            });
            doc.save("clients.pdf");
        }
        else {
            const rows = vm.archivedclients.map(row => ({
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
            doc.text("Archived Client Information", 40, 40);
            doc.autoTable(columns, rows, {
                margin: { top: 60 },
                headerStyles: { fillColor: [54, 213, 216] }
            });
            doc.save("archived clients.pdf");
        }
    }
  }
};
</script>

<style scoped></style>
