<template>
  <div>
    <div class="columns">
      <div class="column">
        <div class="card">
          <ClientForm :client="client" is-new :callback="callback" />
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import ClientForm from "@/components/ClientForm.vue";
import AV from "leancloud-storage";
export default {
  name: "ClientsAddPage",
  components: {
    ClientForm
  },
  data() {
    return {
      client: new AV.Object("Client").set("company", new AV.Object("Company"))
    };
  },
  methods: {
    callback() {
      const vm = this;
      vm.$router.push(`/client/${vm.client.id}`);
    }
  }
};
</script>

<style scoped></style>
