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
        <ThWithSort
          by="nextEvent"
          :sorted-by="sortedBy"
          :sort-order="sortOrder"
          :sort-by="sortBy"
        >
          Next Company Wide Event
        </ThWithSort>
      </tr>
    </thead>
    <tbody>
      <tr v-for="company in sortedCompanies" :key="company.company.id">
        <td>
          <CompanyCombo :company="company.company" />
        </td>
        <td>
          <div v-if="company.nextEvent.get('time')">
            <router-link :to="`/company/${company.company.id}/events`">
              {{
                company.nextEvent.get("name") +
                  " on " +
                  company.nextEvent.get("time").toLocaleString("en-US", {
                    year: "numeric",
                    month: "numeric",
                    day: "numeric",
                    hour: "numeric",
                    minute: "numeric"
                  })
              }}
            </router-link>
          </div>
        </td>
      </tr>
    </tbody>
  </table>
</template>

<script>
import ThWithSort from "@/components/ThWithSort.vue";
import CompanyCombo from "@/components/CompanyCombo.vue";
export default {
  name: "CompaniesTable",
  components: {
    ThWithSort,
    CompanyCombo
  },
  props: {
    companies: Array
  },
  data() {
    return {
      sortedBy: "name",
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
    sortedCompanies() {
      const vm = this;
      if (vm.sortedBy === "nextEvent") {
        return vm.companies.sort((a, b) =>
          a.nextEvent.get("name") > b.nextEvent.get("name")
            ? vm.sortOrder
            : -vm.sortOrder
        );
      } else {
        return vm.companies.sort((a, b) =>
          a.company.get(vm.sortedBy) > b.company.get(vm.sortedBy)
            ? vm.sortOrder
            : -vm.sortOrder
        );
      }
    }
  }
};
</script>

<style scoped></style>
