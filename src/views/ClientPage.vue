<template>
  <div>
    <div class="columns">
      <div class="column">
        <div class="card">
          <section class="fields">
            <h1>{{ client.get("fullName") }}</h1>
            <div class="field">
              <p>{{ client.get("company").get("name") }}</p>
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
  name: "ClientPage",
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
      });
  }
};
</script>

<style scoped></style>
