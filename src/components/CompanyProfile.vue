<template>
  <section class="fields">
    <h1>{{ company.get("name") }}</h1>
    <div>
      <span class="icon">
        <a
          v-if="company.get('linkedin')"
          :href="`https://www.linkedin.com/company/${company.get('linkedin')}`"
          target="_blank"
        >
          <font-awesome-icon :icon="['fab', 'linkedin']" />
        </a>
      </span>
      <span class="icon">
        <a
          v-if="company.get('facebook')"
          :href="`https://www.facebook.com/${company.get('facebook')}`"
          target="_blank"
        >
          <font-awesome-icon :icon="['fab', 'facebook']" />
        </a>
      </span>
      <span class="icon">
        <a
          v-if="company.get('instagram')"
          :href="`https://www.instagram.com/${company.get('instagram')}`"
          target="_blank"
        >
          <font-awesome-icon :icon="['fab', 'instagram']" />
        </a>
      </span>
    </div>
  </section>
</template>

<script>
import AV from "leancloud-storage";
export default {
  name: "CompanyProfile",
  data() {
    return {
      company: new AV.Object("Company")
    };
  },
  created() {
    const vm = this;
    const companyQuery = new AV.Query("Company");
    companyQuery
      .get(vm.$route.params.id)
      .then(company => {
        vm.company = company;
      })
      .catch(error => {
        alert(error);
      });
  }
};
</script>

<style scoped>
.icon {
  font-size: 30pt;
  margin-right: 15pt;
}
</style>
