<template>
  <table>
    <thead>
      <tr>
        <ThWithSort
          by="name"
          :sorted-by="sortedBy"
          :sort-order="sortOrder"
          :sort-by="sortBy"
        >
          Name
        </ThWithSort>
      </tr>
    </thead>
    <tbody>
      <tr v-for="company in sortedCompanies" :key="company.id">
        <td>
          <CompanyCombo :company="company" />
        </td>
      </tr>
    </tbody>
  </table>
</template>

<script>
import ThWithSort from "@/components/ThWithSort.vue";
import CompanyCombo from "@/components/CompanyCombo.vue";
export default {
  name: "ComapniesTable",
  components: {
    ThWithSort,
    CompanyCombo,
  },
  props: {
    companies: Array,
  },
  data() {
    return {
      sortedBy: "name",
      sortOrder: 1,
    };
  },
  methods: {
    sortBy(field) {
      const vm = this;
      vm.sortOrder = vm.sortedBy === field ? -vm.sortOrder : 1;
      vm.sortedBy = field;
    },
  },
  computed: {
    sortedCompanies() {
      const vm = this;
      if (vm.sortedBy === "name") {
        return vm.companies.sort((a, b) =>
          a.get("name") > b.get("name") ? vm.sortOrder : -vm.sortOrder
        );
      } else {
        return vm.companies.sort((a, b) =>
          a.get(vm.sortedBy) > b.get(vm.sortedBy) ? vm.sortOrder : -vm.sortOrder
        );
      }
    },
  },
};
</script>

<style scoped></style>
