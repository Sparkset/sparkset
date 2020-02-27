<template>
  <div>
    <div class="columns">
      <div class="column">
        <div class="card">
          <section class="fields">
            <h1>Clients ({{ clients.length }})</h1>
            <div class="field field--half">
              <label>
                <span>Search</span>
                <input type="text" v-model="search" />
              </label>
            </div>
            <div class="field">
              <table id="clients">
                <thead>
                  <tr>
                    <th @click="sortBy('name')">
                      Name
                      <span v-if="sortedBy === 'name'" class="sort-icon">
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
                            {{ client.get("firstName") }}
                            <span class="last-name">
                              {{ client.get("lastName") }}
                            </span>
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
                          <span class="nick-name">
                            {{ client.get("nickName") }}
                          </span>
                        </span>
                      </span>
                    </td>
                    <td>
                      {{
                        client.get("company")
                          ? client.get("company").get("name")
                          : undefined
                      }}
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
              <div>
                <div class= "field" align = "right">
                  <button class ="primary">Add Client</button>
                </div>
              </div>
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
      search: "",
      clients: [],
      sortedBy: "name",
      sortOrder: 1
    };
  },
  created() {
    const vm = this;
    const clientQuery = new AV.Query("Client");
    clientQuery
      .include("company")
      .limit(1000)
      .find()
      .then(clients => {
        vm.clients = clients;
      })
      .catch(error => {
        alert(error);
      });
  },
  methods: {
    sortBy(field) {
      const vm = this;
      vm.sortOrder = vm.sortedBy === field ? -vm.sortOrder : 1;
      vm.sortedBy = field;
    }
  },
  computed: {
    filteredClients() {
      const vm = this;
      return vm.clients.filter(client =>
        vm.search
          ? [
              client.get("firstName"),
              client.get("lastName"),
              client.get("nickName"),
              client.get("jobTitle"),
              client.get("company")
                ? client.get("company").get("name")
                : undefined,
              client.get("email"),
              client.get("cellPhone")
            ].reduce(
              (accumulator, field) =>
                accumulator ||
                (field || "").toLowerCase().includes(vm.search.toLowerCase()),
              false
            )
          : true
      );
    },
    sortedClients() {
      const vm = this;
      if (vm.sortedBy === "name") {
        return vm.filteredClients
          .sort((a, b) =>
            a.get("firstName") > b.get("firstName")
              ? vm.sortOrder
              : -vm.sortOrder
          )
          .sort((a, b) =>
            a.get("lastName") > b.get("lastName") ? vm.sortOrder : -vm.sortOrder
          );
      } else if (vm.sortedBy === "company") {
        return vm.filteredClients.sort((a, b) =>
          a.get("company").get("name") > b.get("company").get("name")
            ? vm.sortOrder
            : -vm.sortOrder
        );
      } else {
        return vm.filteredClients.sort((a, b) =>
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
.last-name {
  font-weight: 500;
}
.nick-name {
  font-size: 9pt;
  opacity: 0.6;
}
</style>
