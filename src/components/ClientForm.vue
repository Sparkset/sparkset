<template>
  <section class="fields">
    <h1>{{ isNew ? "New Client" : fullName || client.get("fullName") }}</h1>
    <form @submit.prevent="go">
      <div class="field field--half">
        <label>
          <span>Full Name</span>
          <input v-model="fullName" required />
        </label>
      </div>
      <div class="field field--half">
        <label>
          <span>Nickname</span>
          <input v-model="nickname" />
        </label>
      </div>
      <div v-if="isNew" class="field field--half">
        <label>
          <span>Profile Picture</span>
          <input type="file" id="avatar-upload" />
        </label>
      </div>
      <div class="field field--half">
        <label>
          <span>Email</span>
          <input v-model="email" required />
        </label>
      </div>
      <div class="field field--half">
        <label>
          <span>Cell Phone</span>
          <input v-model="cellPhone" required />
        </label>
      </div>
      <div class="field field--half">
        <label>
          <span>Work Phone</span>
          <input v-model="workPhone" required />
        </label>
      </div>
      <div class="field field--half field--with--dropdown">
        <label>
          <span>Company</span>
          <input
            type="text"
            v-model="companyName"
            @input="findCompany"
            @keydown.down="completeCompanyWithPrediction"
            @blur="completeCompany"
            required
          />
          <div
            class="dropdown"
            :style="{
              display:
                companyPrediction.get('name') &&
                companyName !== companyPrediction.get('name')
                  ? null
                  : 'none'
            }"
          >
            <span class="dropdown__left">
              {{ companyPrediction.get("name") }}
            </span>
            <span class="dropdown__right">
              <kbd>
                <font-awesome-icon icon="arrow-down" />
              </kbd>
            </span>
          </div>
        </label>
      </div>
      <div class="field field--half">
        <label>
          <span>Company Facebook</span>
          <input v-model="companyFacebook" required />
        </label>
      </div>
      <div class="field field--half">
        <label>
          <span>Company Instagram</span>
          <input v-model="companyInstagram" required />
        </label>
      </div>
      <div class="field field--half">
        <label>
          <span>Company LinkedIn</span>
          <input v-model="companyLinkedin" required />
        </label>
      </div>
      <div class="field field--half">
        <label>
          <span>Job Title</span>
          <input v-model="jobTitle" required />
        </label>
      </div>
      <div class="field field--half">
        <label>
          <span>Job Description</span>
          <input v-model="jobDescription" required />
        </label>
      </div>
      <div class="field">
        <button type="submit" class="primary">Save</button>
      </div>
    </form>
  </section>
</template>

<script>
import AV from "leancloud-storage";
export default {
  name: "ClientForm",
  props: {
    client: AV.Object,
    isNew: Boolean,
    callback: Function
  },
  data() {
    return {
      fullName: "",
      nickname: "",
      email: "",
      cellPhone: "",
      workPhone: "",
      companyName: "",
      company: new AV.Object("Company"),
      companyPrediction: new AV.Object("Company"),
      companyFacebook: "",
      companyInstagram: "",
      companyLinkedin: "",
      jobTitle: "",
      jobDescription: ""
    };
  },
  methods: {
    findCompany() {
      const vm = this;
      if (vm.companyName) {
        const companyQuery = new AV.Query("Company");
        companyQuery
          .equalTo("name", vm.companyName)
          .first()
          .then(company => {
            vm.company = company || new AV.Object("Company");
          });
        const companyQueryForPrediction = new AV.Query("Company");
        companyQueryForPrediction
          .startsWith("name", vm.companyName)
          .first()
          .then(company => {
            vm.companyPrediction = company || new AV.Object("Company");
          });
      } else {
        vm.company = new AV.Object("Company");
        vm.companyPrediction = new AV.Object("Company");
      }
    },
    completeCompanyWithPrediction() {
      const vm = this;
      vm.company = vm.companyPrediction;
      vm.companyName = vm.company.get("name");
      vm.completeCompany();
    },
    completeCompany() {
      const vm = this;
      vm.companyFacebook = vm.company.get("facebook");
      vm.companyInstagram = vm.company.get("instagram");
      vm.companyLinkedin = vm.company.get("linkedin");
    },
    go() {
      const vm = this;
      vm.company
        .set("name", vm.companyName)
        .set("facebook", vm.companyFacebook)
        .set("instagram", vm.companyInstagram)
        .set("linkedin", vm.companyLinkedin);
      if (vm.isNew) {
        const avatarUpload = document.getElementById("avatar-upload");
        let file = null;
        if (avatarUpload.files.length) {
          const localFile = avatarUpload.files[0];
          file = new AV.File("avatar", localFile);
        }
        vm.client.set("picture", file);
      }
      vm.client
        .set("fullName", vm.fullName)
        .set("nickname", vm.nickname)
        .set("email", vm.email)
        .set("cellPhone", vm.cellPhone)
        .set("workPhone", vm.workPhone)
        .set("company", vm.company)
        .set("jobTitle", vm.jobTitle)
        .set("jobDescription", vm.jobDescription)
        .save()
        .then(vm.callback)
        .catch(error => {
          alert(error);
        });
    }
  },
  created() {
    const vm = this;
    vm.fullName = vm.client.get("fullName");
    vm.nickname = vm.client.get("nickname");
    vm.email = vm.client.get("email");
    vm.cellPhone = vm.client.get("cellPhone");
    vm.workPhone = vm.client.get("workPhone");
    vm.companyName = vm.client.get("company").get("name");
    vm.company = vm.client.get("company");
    vm.companyFacebook = vm.client.get("company").get("facebook");
    vm.companyInstagram = vm.client.get("company").get("instagram");
    vm.companyLinkedin = vm.client.get("company").get("linkedin");
    vm.jobTitle = vm.client.get("jobTitle");
    vm.jobDescription = vm.client.get("jobDescription");
  }
};
</script>

<style scoped>
.dropdown__left {
  float: left;
}
.dropdown__right {
  float: right;
}
.dropdown__right > kbd {
  font-size: 6pt;
}
</style>
