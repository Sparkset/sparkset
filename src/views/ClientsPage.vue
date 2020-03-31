<template>
  <div>
    <div class="column">
      <div class="card">
        <section class="fields">
          <h1>
            Showing {{ clients.length }}
            {{ clients.length === 1 ? "Client" : "Clients" }}
          </h1>
          <div class="field field--half">
            <label>
              <span>Whose</span>
              <select v-model="selectedField" @change="search">
                <option
                  v-for="(field, index) in fields"
                  :key="field.name"
                  :value="index"
                >
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
          <div class="field field--superwide">
            <ClientsTable :clients="clients" show-company />
          </div>
        </section>
      </div>
    </div>
  </div>
</template>

<script>
import ClientsTable from "@/components/ClientsTable.vue";
import AV from "leancloud-storage";
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
      selectedField: 0,
      query: "",
      clients: []
    };
  },
  created() {
    const vm = this;
    vm.search();
  },
  methods: {
    search() {
      const vm = this;
      if (vm.fields[vm.selectedField].class === "Client") {
        const clientQuery = new AV.Query("Client");
        clientQuery
          .contains(vm.fields[vm.selectedField].key, vm.query)
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
        companyQuery.contains(vm.fields[vm.selectedField].key, vm.query);
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
