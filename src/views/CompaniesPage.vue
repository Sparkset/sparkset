<template>
  <div>
    <div class="column">
      <div class="card">
        <section class="fields">
          <h1>
            Showing {{ companies.length }}
            {{ companies.length === 1 ? "Company" : "Companies" }}
          </h1>
          <div class="field field--superwide">
            <CompaniesTable :companies="companies" :nextEvents="nextEvents" />
          </div>
        </section>
      </div>
    </div>
  </div>
</template>

<script>
import CompaniesTable from "@/components/CompaniesTable.vue";
import AV from "leancloud-storage";
export default {
  name: "CompaniesPage",
  components: {
    CompaniesTable
  },
  data() {
    return {
      companies: [],
      nextEvents: {}
    };
  },
  created() {
    const vm = this;
    vm.getCompanies();
  },
  methods: {
    getCompanies() {
      const vm = this;
      const companyQuery = new AV.Query("Company");
      companyQuery
        .limit(1000)
        .find()
        .then(companies => {
          vm.companies = companies;
        })
        .catch(error => {
          alert(error);
        });
    }
  }
};
</script>

<style scoped></style>
