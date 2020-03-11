<template>
  <div>
    <div class="columns">
      <div class="column">
        <div class="card">
          <section class="fields">
            <h1>New Client</h1>
            <div class="field">
              <p>Enter information for new client.</p>
            </div>
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
              <div class="field field--half">
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
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import AV from "leancloud-storage";
export default {
  name: "ClientsAddPage",
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
      const avatarUpload = document.getElementById("avatar-upload");
      let file = null;
      if (avatarUpload.files.length) {
        const localFile = avatarUpload.files[0];
        file = new AV.File("avatar", localFile);
      }
      const client = new AV.Object("Client");
      client
        .set("fullName", vm.fullName)
        .set("nickname", vm.nickname)
        .set("picture", file)
        .set("email", vm.email)
        .set("cellPhone", vm.cellPhone)
        .set("workPhone", vm.workPhone)
        .set("company", vm.company)
        .set("jobTitle", vm.jobTitle)
        .set("jobDescription", vm.jobDescription)
        .save()
        .then(() => {
          vm.$router.push(`/client/${client.id}`);
        })
        .catch(error => {
          alert(error);
        });
    }
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
