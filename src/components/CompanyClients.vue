<template>
  <section class="fields">
    <h1>
      {{ clients.length }}
      {{ clients.length === 1 ? "Client Belongs" : "Clients Belong" }} to
      {{ company.get("name") }}
    </h1>
    <div class="field">
      <ClientsTable :clients="clients" />
    </div>
  </section>
</template>

<script>
import ClientsTable from "@/components/ClientsTable.vue";
import AV from "leancloud-storage";
export default {
  name: "CompanyClients",
  components: {
    ClientsTable
  },
  data() {
    return {
      company: new AV.Object("Company"),
      clients: []
    };
  },
  created() {
    const vm = this;
    const companyQuery = new AV.Query("Company");
    companyQuery
      .get(vm.$route.params.id)
      .then(company => {
        vm.company = company;
        const clientQuery = new AV.Query("Client");
        clientQuery
          .equalTo("company", vm.company)
          .find()
          .then(clients => {
            vm.clients = clients;
          })
          .catch(error => {
            alert(error);
          });
      })
      .catch(error => {
        alert(error);
      });
  }
};
</script>

<style scoped></style>
