<template> </template>

<script>
import AV from "leancloud-storage";
export default {
  name: "CompanyPage",
  data() {
    return {
      companyName: "",
      clientsAssociated: [],
      instagram: "",
      facebook: "",
      linkedin: "",
      id: ""
    };
  },
  created() {
    const vm = this;
    vm.companyName = vm.$route.query.company;
    const companyQuery = new AV.Query("Company");
    companyQuery
      .equalTo("name", vm.companyName)
      .find()
      .then(
        company =>
          function(company) {
            vm.instagram = company.instagram;
            vm.facebook = company.facebook;
            vm.linkedin = company.linkedin;
            vm.id = company.objectId;
          }
      );
    clientQuery = new AV.Query("Client");
    clientQuery
      .equalTo("company", vm.id)
      .find()
      .then(clients => {
        vm.clientsAssociated = clients.map(client => ({
          name: client.get("fullName"),
          id: client.id,
          client
        }));
      });
  }
};
</script>
