<template>
  <span class="combo">
    <span>
      <span>
        <router-link :to="`/company/${company.id}`" class="text">
          {{ companyName }}
        </router-link>
        <a
          v-if="companyLinkedin != ''"
          :href="`https://www.linkedin.com/in/${companyLinkedin}`"
          target="_blank"
        >
          <font-awesome-icon :icon="['fab', 'linkedin']" />
        </a>
      </span>
    </span>
  </span>
</template>

<script>
import AV from "leancloud-storage";
export default {
  name: "CompanyCombo",
  props: {
    company: AV.Object
  },
  data() {
    return {
      companyName: "",
      companyLinkedin: ""
    };
  },
  created() {
    const vm = this;
    const companyQuery = new AV.Query("Company");
    companyQuery
      .get(vm.company.id)
      .then(c => {
        vm.companyName = c.get("name");
        vm.companyLinkedin = c.get("linkedin");
      })
      .catch(error => {
        alert(error);
      });
  }
};
</script>

<style scoped>
.combo {
  display: flex;
  align-items: center;
  margin-top: 7px;
  margin-left: 5px;
  color: #36d5d8;
}
.text {
}
</style>
