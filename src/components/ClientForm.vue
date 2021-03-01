<template>
  <section class="fields">
    <h1>{{ isNew ? "New Client" : fullName || client.get("fullName") }}</h1>
    <form @submit.prevent="go">
      <div class="field field--half">
        <label>
          <a v-if="editing">
            <span class="required-field">Full Name </span>
          </a>
          <a v-else>
            <span>Full Name</span>
          </a>
          <input v-model="fullName" type="text" required :disabled="!editing" />
        </label>
      </div>
      <div class="field field--half">
        <label>
          <span>Nickname</span>
          <input v-model="nickname" type="text" :disabled="!editing" />
        </label>
      </div>
      <div class="field field--half">
        <label>
          <span>
            Email 
            <a
              v-if="!editing && client.get('email')"
              :href="`mailto:${client.get('email')}`"
            >
              <font-awesome-icon :icon="['fas', 'paper-plane']" />
            </a>
            <a v-else>
              <span class="required-field"></span>
            </a>
          </span>
          <input v-model="email" type="email" required :disabled="!editing" />
        </label>
      </div>
      <div class="field field--half">
        <label>
          <span>
            LinkedIn
            <a
              v-if="!editing && client.get('linkedin')"
              :href="`https://www.linkedin.com/in/${client.get('linkedin')}`"
              target="_blank"
            >
              <font-awesome-icon :icon="['fab', 'linkedin']" />
            </a>
          </span>
          <input v-model="linkedin" type="text" :disabled="!editing" />
        </label>
      </div>
      <div class="field field--half">
        <label>
          <span>
          Cell Phone
          <a
            v-if="!editing && client.get('cellPhone')"
            :href="`tel:${client.get('cellPhone')}`"
          >
            <font-awesome-icon :icon="['fas', 'phone-alt']" />
          </a>
          <a v-else>
            <span class="required-field"></span>
          </a>
          </span>
          <input v-model="cellPhone" type="tel" required :disabled="!editing" />
        </label>
      </div>
      <div class="field field--half">
        <label>
          <span>
            Work Phone
            <a
              v-if="!editing && client.get('workPhone')"
              :href="`tel:${client.get('workPhone')}`"
            >
              <font-awesome-icon :icon="['fas', 'phone-alt']" />
            </a>
            <a v-else>
              <span class="required-field"></span>
            </a>
          </span>
          <input v-model="workPhone" type="tel" required :disabled="!editing" />
        </label>
      </div>
      <div class="field field--half">
        <label>
          <span>Address</span>
          <input v-model="address" type="text" :disabled="!editing" />
        </label>
      </div>
      <div class="field field--half">
        <label>
          <span>Communication Channel</span>
          <input v-model="commChannelPref" type="text" :disabled="!editing" />
        </label>
      </div>
      <div class="field field--half">
        <label>
          <span>Communication Time</span>
          <input v-model="commTimePref" type="text" :disabled="!editing" />
        </label>
      </div>
      <div class="field field--half">
        <label>
          <span>Communication Frequency</span>
          <input v-model="commFrequencyPref" type="text" :disabled="!editing" />
        </label>
      </div>
      <div class="field field--half field--with--dropdown">
        <label>
          <span>
            Company (Case Sensitive)
            <router-link
              v-if="!editing && client.get('company').id"
              :to="`/company/${client.get('company').id}`"
            >
              <font-awesome-icon :icon="['fas', 'building']" />
            </router-link>
            <a v-if="editing">
              <span class="required-field"></span>
            </a>
          </span>
          <input
            type="text"
            v-model="companyName"
            @input="findCompany"
            @keydown.down = "completeCompanyWithPrediction"
            @blur="completeCompany"
            required
            :disabled="!editing"
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
                <font-awesome-icon :icon="['fas', 'arrow-down']" />
              </kbd>
            </span>
          </div>
        </label>
      </div>
      <div class="field field--half">
        <label>
          <span>
            Company LinkedIn
            <a
              v-if="!editing && client.get('company').get('linkedin')"
              :href="
                `https://www.linkedin.com/company/${client
                  .get('company')
                  .get('linkedin')}`
              "
              target="_blank"
            >
              <font-awesome-icon :icon="['fab', 'linkedin']" />
            </a>
          </span>
          <input v-model="companyLinkedin" type="text" :disabled="!editing" />
        </label>
      </div>
      <div class="field field--half">
        <label>
          <span>
            Company Facebook
            <a
              v-if="!editing && client.get('company').get('facebook')"
              :href="
                `https://www.facebook.com/${client
                  .get('company')
                  .get('facebook')}`
              "
              target="_blank"
            >
              <font-awesome-icon :icon="['fab', 'facebook-square']" />
            </a>
          </span>
          <input v-model="companyFacebook" type="text" :disabled="!editing" />
        </label>
      </div>
      <div class="field field--half">
        <label>
          <span>
            Company Instagram
            <a
              v-if="!editing && client.get('company').get('instagram')"
              :href="
                `https://www.instagram.com/${client
                  .get('company')
                  .get('instagram')}`
              "
              target="_blank"
            >
              <font-awesome-icon :icon="['fab', 'instagram-square']" />
            </a>
          </span>
          <input v-model="companyInstagram" type="text" :disabled="!editing" />
        </label>
      </div>
      <div class="field field--half">
        <label>
          <span>Job Title 
            <a v-if="editing">
              <span class="required-field"></span>
            </a>  
          </span>
          <input v-model="jobTitle" type="text" required :disabled="!editing" />
        </label>
      </div>
      <div class="field field--half">
        <label>
          <span>Job Description</span>
          <input v-model="jobDescription" type="text" :disabled="!editing" />
        </label>
      </div>
      <div v-if="isNew" class="field field--half">
        <label>
          <span>Profile Picture</span>
          <input type="file" ref="picturesInput" />
        </label>
      </div>
      <div v-if="editingCompanyPicture" class="field field--half">
        <label>
          <span>Company Profile Picture</span>
          <input type="file" ref="companyPicturesInput" />
        </label>
      </div>
      <div v-if="editing" class="field">
        <button type="submit" class="primary">Save</button>
        <button type="button" @click="editing = false">
          Cancel
        </button>
      </div>
    </form>
    <div v-if="!editing" class="field">
      <button class="primary" @click="editing = true">
        Edit
      </button>
    </div>
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
      editing: false,
      fullName: "",
      nickname: "",
      email: "",
      linkedin: "",
      cellPhone: "",
      workPhone: "",
      address: "",
      commChannelPref: "",
      commTimePref: "",
      commFrequencyPref: "",
      companyName: "",
      company: new AV.Object("Company"),
      companyPrediction: new AV.Object("Company"),
      companyLinkedin: "",
      companyFacebook: "",
      companyInstagram: "",
      jobTitle: "",
      jobDescription: "",
      editingCompanyPicture: false
    };
  },
  created() {
    const vm = this;
    vm.editing = vm.isNew;
    vm.fullName = vm.client.get("fullName");
    vm.nickname = vm.client.get("nickname");
    vm.email = vm.client.get("email");
    vm.linkedin = vm.client.get("linkedin");
    vm.cellPhone = vm.client.get("cellPhone");
    vm.workPhone = vm.client.get("workPhone");
    vm.address = vm.client.get("address");
    vm.commChannelPref = vm.client.get("commChannelPref");
    vm.commTimePref = vm.client.get("commTimePref");
    vm.commFrequencyPref = vm.client.get("commFrequencyPref");
    vm.companyName = vm.client.get("company").get("name");
    vm.company = vm.client.get("company");
    vm.companyLinkedin = vm.client.get("company").get("linkedin");
    vm.companyFacebook = vm.client.get("company").get("facebook");
    vm.companyInstagram = vm.client.get("company").get("instagram");
    vm.jobTitle = vm.client.get("jobTitle");
    vm.jobDescription = vm.client.get("jobDescription");
  },
  methods: {
    findCompany() {
      const vm = this;
      if (vm.companyName) {
        const companyQuery = new AV.Query("Company");
        companyQuery
          .equalTo("name", vm.companyName)
          // .matches("name",new RegExp(vm.companyName, "i"))
          .first()
          .then(company => {
            if (company) {
              vm.company = company;
              vm.editingCompanyPicture = false;
            } else {
              vm.company = new AV.Object("Company");
              vm.editingCompanyPicture = true;
            }
          })
          .catch(error => {
            alert(error);
          });
        const companyQueryForPrediction = new AV.Query("Company");
        companyQueryForPrediction
          .startsWith("name", vm.companyName)
          // .matches("name",new RegExp(vm.companyName, "i"))
          .first()
          .then(company => {
            vm.companyPrediction = company || new AV.Object("Company");
          })
          .catch(error => {
            alert(error);
          });
      } else {
        vm.company = new AV.Object("Company");
        vm.editingCompanyPicture = false;
        vm.companyPrediction = new AV.Object("Company");
      }
    },
    completeCompanyWithPrediction() {
      const vm = this;
      vm.editingCompanyPicture = false;
      vm.company = vm.companyPrediction;
      vm.companyName = vm.company.get("name");
      vm.companyLinkedin = vm.company.get("linkedin");
      vm.companyFacebook = vm.company.get("facebook");
      vm.companyInstagram = vm.company.get("instagram");
      vm.completeCompany();
    },
    completeCompany() {
      const vm = this;
      vm.companyLinkedin = vm.company.get("linkedin");
      vm.companyFacebook = vm.company.get("facebook");
      vm.companyInstagram = vm.company.get("instagram");
    },
    go() {
      const vm = this;
      vm.company
        .set("name", vm.companyName)
        .set("linkedin", vm.companyLinkedin)
        .set("facebook", vm.companyFacebook)
        .set("instagram", vm.companyInstagram);
      if (
        vm.editingCompanyPicture &&
        vm.$refs.companyPicturesInput.files.length
      ) {
        const picture = vm.$refs.companyPicturesInput.files[0];
        const file = new AV.File(picture.name, picture);
        vm.company.set("picture", file);
      }
      if (vm.isNew && vm.$refs.picturesInput.files.length) {
        const picture = vm.$refs.picturesInput.files[0];
        const file = new AV.File(picture.name, picture);
        vm.client.set("picture", file);
      }
      vm.client
        .set("fullName", vm.fullName)
        .set("nickname", vm.nickname)
        .set("email", vm.email)
        .set("linkedin", vm.linkedin)
        .set("cellPhone", vm.cellPhone)
        .set("workPhone", vm.workPhone)
        .set("address", vm.address)
        .set("commChannelPref", vm.commChannelPref)
        .set("commTimePref", vm.commTimePref)
        .set("commFrequencyPref", vm.commFrequencyPref)
        .set("company", vm.company)
        .set("jobTitle", vm.jobTitle)
        .set("jobDescription", vm.jobDescription)
        .save()
        .then(() => {
          vm.callback();
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
  content:"*";
  color:red;
}
</style>
