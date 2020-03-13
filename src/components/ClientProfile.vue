<template>
  <ClientForm :client="client" :key="client.id" :callback="callback" />
</template>

<script>
import ClientForm from "@/components/ClientForm.vue";
import AV from "leancloud-storage";
export default {
  name: "ClientProfile",
  components: {
    ClientForm
  },
  data() {
    return {
      client: new AV.Object("Client").set("company", new AV.Object("Company"))
    };
  },
  created() {
    const vm = this;
    const clientQuery = new AV.Query("Client");
    clientQuery
      .include("company")
      .get(vm.$route.params.id)
      .then(client => {
        vm.client = client;
      })
      .catch(error => {
        alert(error);
      });
  },
  methods: {
    callback() {
      alert("Profile updated.");
    }
  }
};
</script>

<style scoped></style>
