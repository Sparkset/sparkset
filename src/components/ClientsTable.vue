<template>
  <table>
    <thead>
      <tr>
        <th class="sortable" @click="sortBy('fullName')">
          Name
          <span v-if="sortedBy === 'fullName'">
            <font-awesome-icon
              :icon="[
                'fas',
                sortOrder === 1 ? 'long-arrow-alt-up' : 'long-arrow-alt-down'
              ]"
            />
          </span>
        </th>
        <th v-if="showCompany" class="sortable" @click="sortBy('company')">
          Company
          <span v-if="sortedBy === 'company'">
            <font-awesome-icon
              :icon="[
                'fas',
                sortOrder === 1 ? 'long-arrow-alt-up' : 'long-arrow-alt-down'
              ]"
            />
          </span>
        </th>
        <th class="sortable" @click="sortBy('jobTitle')">
          Job Title
          <span v-if="sortedBy === 'jobTitle'">
            <font-awesome-icon
              :icon="[
                'fas',
                sortOrder === 1 ? 'long-arrow-alt-up' : 'long-arrow-alt-down'
              ]"
            />
          </span>
        </th>
        <th class="sortable" @click="sortBy('email')">
          Email
          <span v-if="sortedBy === 'email'">
            <font-awesome-icon
              :icon="[
                'fas',
                sortOrder === 1 ? 'long-arrow-alt-up' : 'long-arrow-alt-down'
              ]"
            />
          </span>
        </th>
        <th class="sortable" @click="sortBy('cellPhone')">
          Cell Phone
          <span v-if="sortedBy === 'cellPhone'">
            <font-awesome-icon
              :icon="[
                'fas',
                sortOrder === 1 ? 'long-arrow-alt-up' : 'long-arrow-alt-down'
              ]"
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
                    `https://www.linkedin.com/in/${client.get('linkedin')}`
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
        <td v-if="showCompany">
          <router-link :to="`/company/${client.get('company').id}`">
            {{ client.get("company").get("name") }}
          </router-link>
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
</template>

<script>
export default {
  name: "ClientsTable",
  props: {
    clients: Array,
    showCompany: Boolean
  },
  data() {
    return {
      sortedBy: "fullName",
      sortOrder: 1
    };
  },
  methods: {
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
