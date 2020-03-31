<template>
  <div>
    <h1>{{ companyName }}</h1>
    <h2>Social Media</h2>
    <div class="iconBlock">
      <span class="icon">
        <a
          v-if="linkedin"
          :href="`https://www.linkedin.com/in/${linkedin}}`"
          target="_blank"
        >
          <font-awesome-icon :icon="['fab', 'linkedin']" />
        </a>
      </span>

      <span class="icon">
        <a
          v-if="facebook"
          :href="`https://www.facebook.com/${facebook}}`"
          target="_blank"
        >
          <font-awesome-icon :icon="['fab', 'facebook']" />
        </a>
      </span>
      <span class="icon">
        <a
          v-if="instagram"
          :href="`https://www.instagram.com/${instagram}}`"
          target="_blank"
        >
          <font-awesome-icon :icon="['fab', 'instagram']" />
        </a>
      </span>
    </div>
  </div>
</template>

<script>
import AV from "leancloud-storage";
export default {
  name: "CompanyPage",
  data() {
    return {
      companyName: "",
      clients: [],
      instagram: "",
      facebook: "",
      linkedin: "",
      id: ""
    };
  },
  created() {
    const vm = this;
    vm.id = vm.$route.params.id;
    const companyQuery = new AV.Query("Company");
    companyQuery.get(vm.id).then(company => {
      vm.instagram = company.get("instagram");
      vm.facebook = company.get("facebook");
      vm.linkedin = company.get("linkedin");
      vm.companyName = company.get("name");
    });
    const companyObject = AV.Object.createWithoutData("Company", vm.id);
    const clientQuery = new AV.Query("Client");
    clientQuery
      .equalTo("company", companyObject)
      .find()
      .then(clients => {
        vm.clients = clients.map(client => ({
          name: client.get("fullName"),
          id: client.id,
          client
        }));
        console.log("Clients length = " + vm.clients.length);
      });
  }
};
</script>

<style scoped>
.icon {
  font-size: 30pt;
  padding-right: 15pt;
  padding-left: 0pt;
}

.iconBlock {
  display: flex;
}
</style>
