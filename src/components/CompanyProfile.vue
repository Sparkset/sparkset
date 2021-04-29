<template>
  <section class="fields">
    <h1>{{ pendingChanges.name || company.get("name") }}</h1>
    <form @submit.prevent="go">
      <div class="field field--half">
        <label>
          <span class="required-field">Company Name</span>
          <input
            v-model="pendingChanges.name"
            type="text"
            required
            :disabled="!editing"
          />
        </label>
      </div>
      <div class="field field--half">
        <label>
          <span>
            Company LinkedIn
            <a
              v-if="!editing && company.get('linkedin')"
              :href="
                `https://www.linkedin.com/company/${company.get('linkedin')}`
              "
              target="_blank"
            >
              <font-awesome-icon :icon="['fab', 'linkedin']" />
            </a>
          </span>
          <input
            v-model="pendingChanges.linkedin"
            type="text"
            :disabled="!editing"
          />
        </label>
      </div>
      <div class="field field--half">
        <label>
          <span>
            Company Facebook
            <a
              v-if="!editing && company.get('facebook')"
              :href="`https://www.facebook.com/${company.get('facebook')}`"
              target="_blank"
            >
              <font-awesome-icon :icon="['fab', 'facebook-square']" />
            </a>
          </span>
          <input
            v-model="pendingChanges.facebook"
            type="text"
            :disabled="!editing"
          />
        </label>
      </div>
      <div class="field field--half">
        <label>
          <span>
            Company Instagram
            <a
              v-if="!editing && company.get('instagram')"
              :href="`https://www.instagram.com/${company.get('instagram')}`"
              target="_blank"
            >
              <font-awesome-icon :icon="['fab', 'instagram-square']" />
            </a>
          </span>
          <input
            v-model="pendingChanges.instagram"
            type="text"
            :disabled="!editing"
          />
        </label>
      </div>
      <div v-if="editing" class="field">
        <button type="submit" class="primary">Save</button>
      </div>
    </form>
    <div v-if="!editing" class="field">
      <button @click="editing = true">
        Edit
      </button>
    </div>
  </section>
</template>

<script>
import AV from "leancloud-storage";
export default {
  name: "CompanyProfile",
  data() {
    return {
      company: new AV.Object("Company"),
      editing: false,
      pendingChanges: {
        name: "",
        linkedin: "",
        facebook: "",
        instagram: ""
      }
    };
  },
  created() {
    const vm = this;
    const companyQuery = new AV.Query("Company");
    companyQuery
      .get(vm.$route.params.id)
      .then(company => {
        vm.company = company;
        vm.pendingChanges.name = vm.company.get("name");
        vm.pendingChanges.linkedin = vm.company.get("linkedin");
        vm.pendingChanges.facebook = vm.company.get("facebook");
        vm.pendingChanges.instagram = vm.company.get("instagram");
      })
      .catch(error => {
        alert(error);
      });
  },
  methods: {
    go() {
      const vm = this;
      vm.company
        .set("name", vm.pendingChanges.name)
        .set("linkedin", vm.pendingChanges.linkedin)
        .set("facebook", vm.pendingChanges.facebook)
        .set("instagram", vm.pendingChanges.instagram)
        .save()
        .then(() => {
          alert("Profile updated.");
          vm.editing = false;
        })
        .catch(error => {
          alert(error);
        });
    }
  }
};
</script>

<style scoped>
.required-field::after{
    content:" *";
    color:red;
}
</style>