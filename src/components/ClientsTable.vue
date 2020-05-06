<template>
  <table>
    <thead>
      <tr>
        <ThWithSort
          by="fullName"
          :sorted-by="sortedBy"
          :sort-order="sortOrder"
          :sort-by="sortBy"
        >
          Name
        </ThWithSort>
        <ThWithSort
          v-if="showCompany"
          by="company"
          :sorted-by="sortedBy"
          :sort-order="sortOrder"
          :sort-by="sortBy"
        >
          Company
        </ThWithSort>
        <ThWithSort
          by="jobTitle"
          :sorted-by="sortedBy"
          :sort-order="sortOrder"
          :sort-by="sortBy"
        >
          Job Title
        </ThWithSort>
        <ThWithSort
          by="email"
          :sorted-by="sortedBy"
          :sort-order="sortOrder"
          :sort-by="sortBy"
        >
          Email
        </ThWithSort>
        <ThWithSort
          by="cellPhone"
          :sorted-by="sortedBy"
          :sort-order="sortOrder"
          :sort-by="sortBy"
        >
          Cell Phone
        </ThWithSort>
      </tr>
    </thead>
    <tbody>
      <tr v-for="client in sortedClients" :key="client.id">
        <td>
          <ClientCombo :client="client" />
        </td>
        <td v-if="showCompany">
          <router-link :to="`/company/${client.get('company').id}`">
            <CompanyCombo :company="client.get('company')" />
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
import ThWithSort from "@/components/ThWithSort.vue";
import ClientCombo from "@/components/ClientCombo.vue";
import CompanyCombo from "@/components/CompanyCombo.vue";
export default {
  name: "ClientsTable",
  components: {
    ThWithSort,
    ClientCombo,
    CompanyCombo
  },
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

<style scoped></style>
