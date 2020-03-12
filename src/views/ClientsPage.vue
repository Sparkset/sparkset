<template>
  <div>
    <div class="columns">
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
              <router-link to="/clients/add" tag="button">
                Add Client
              </router-link>
            </div>
            <div class="field">
              <table id="clients">
                <thead>
                  <tr>
                    <th @click="sortBy('fullName')">
                      Name
                      <span v-if="sortedBy === 'fullName'" class="sort-icon">
                        <font-awesome-icon
                          :icon="
                            sortOrder === 1
                              ? 'long-arrow-alt-up'
                              : 'long-arrow-alt-down'
                          "
                        />
                      </span>
                    </th>
                    <th @click="sortBy('company')">
                      Company
                      <span v-if="sortedBy === 'company'" class="sort-icon">
                        <font-awesome-icon
                          :icon="
                            sortOrder === 1
                              ? 'long-arrow-alt-up'
                              : 'long-arrow-alt-down'
                          "
                        />
                      </span>
                    </th>
                    <th @click="sortBy('jobTitle')">
                      Job Title
                      <span v-if="sortedBy === 'jobTitle'" class="sort-icon">
                        <font-awesome-icon
                          :icon="
                            sortOrder === 1
                              ? 'long-arrow-alt-up'
                              : 'long-arrow-alt-down'
                          "
                        />
                      </span>
                    </th>
                    <th @click="sortBy('email')">
                      Email
                      <span v-if="sortedBy === 'email'" class="sort-icon">
                        <font-awesome-icon
                          :icon="
                            sortOrder === 1
                              ? 'long-arrow-alt-up'
                              : 'long-arrow-alt-down'
                          "
                        />
                      </span>
                    </th>
                    <th @click="sortBy('cellPhone')">
                      Cell Phone
                      <span v-if="sortedBy === 'cellPhone'" class="sort-icon">
                        <font-awesome-icon
                          :icon="
                            sortOrder === 1
                              ? 'long-arrow-alt-up'
                              : 'long-arrow-alt-down'
                          "
                        />
                      </span>
                    </th>
                  </tr>
                </thead>
                <tbody>
                  <tr v-for="client in sortedClients" :key="client.id">
                    <td>
                      <span class="picture-name-combo">
                        <img
                          :src="
                            client.get('picture')
                              ? client.get('picture').url()
                              : 'https://www.gravatar.com/avatar/00000000000000000000000000000000?d=mp&f=y'
                          "
                        />
                        <span>
                          <span>
                            <router-link :to="`/client/${client.id}`">
                              {{ client.get("fullName") }}
                            </router-link>
                            <a
                              v-if="client.get('linkedin')"
                              :href="
                                `https://www.linkedin.com/in/${client.get(
                                  'linkedin'
                                )}`
                              "
                              target="_blank"
                            >
                              <font-awesome-icon :icon="['fab', 'linkedin']" />
                            </a>
                          </span>
                          <br />
                          <span class="nickname">
                            {{ client.get("nickname") }}
                          </span>
                        </span>
                      </span>
                    </td>
                    <td>
                      {{ client.get("company").get("name") }}
                    </td>
                    <td>{{ client.get("jobTitle") }}</td>
                    <td>
                      <a :href="`mailto:${client.get('email')}`">
                        {{ client.get("email") }}
                      </a>
                    </td>
                    <td>
                      <a :href="`tel:${client.get('cellPhone')}`">
                        {{ client.get("cellPhone") }}
                      </a>
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>
          </section>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import AV from "leancloud-storage";
export default {
  name: "ClientsPage",
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
      clients: [],
      sortedBy: "fullName",
      sortOrder: 1
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
    },
    sortBy(field) {
      const vm = this;
      vm.sortOrder = vm.sortedBy === field ? -vm.sortOrder : 1;
      vm.sortedBy = field;
    }
  },
  computed: {
    sortedClients() {
      const vm = this;
      if (vm.sortedBy === "company") {
        return vm.clients.sort((a, b) =>
          a.get("company").get("name") > b.get("company").get("name")
            ? vm.sortOrder
            : -vm.sortOrder
        );
      } else {
        return vm.clients.sort((a, b) =>
          a.get(vm.sortedBy) > b.get(vm.sortedBy) ? vm.sortOrder : -vm.sortOrder
        );
      }
    }
  }
};
</script>

<style scoped>
#clients {
  table-layout: fixed;
}
#clients > thead > tr > th {
  cursor: pointer;
}
.sort-icon {
  opacity: 0.4;
}
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
