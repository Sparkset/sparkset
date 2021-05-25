<template>
  <div>
    <div class="column">
      <div class="card">
        <section class="fields">
          <h1>Basic Information</h1>
          <!-- saveChanges is a method... check the bottom for what it does-->
          <form @submit.prevent="saveChanges">
            <div class="field field--half">
              <label>
                <a v-if="editing">
                  <span class="required-field">Full Name</span>
                </a>
                <a v-else>
                  <span>Full Name </span>
                </a>
                <input
                  v-model="fullName"
                  type="text"
                  autocomplete="name"
                  required
                  :disabled="!editing"
                />
              </label>
            </div>
            <div class="field field--half">
              <label>
                <a v-if="editing">
                  <span class="required-field">Email</span>
                </a>
                <a v-else>
                  <span>Email </span>
                </a>
                <input
                  v-model="email"
                  type="email"
                  autocomplete="email"
                  required
                  :disabled="!editing"
                />
              </label>
            </div>
            <div class="field field--half">
              <label>
                <!-- <span>Phone Number</span> -->
                <a v-if="editing">
                  <span class="required-field">Phone Number</span>
                </a>
                <a v-else>
                  <span>Phone Number </span>
                </a>
                <input
                  v-model="mobilePhoneNumber"
                  type="tel"
                  required
                  :disabled="!editing"
                  autocomplete="tel"
                />
              </label>
            </div>
            <div v-if="editing" class="field">
              <button type="submit" class="primary">Save</button>
              <button type="button" @click="editing = false">Cancel</button>
            </div>
          </form>
          <div v-if="!editing" class="field">
            <button @click="editing = true" class="primary">Edit</button>
          </div>
        </section>
        <section class="fields">
          <h1>Change Password</h1>
          <form @submit.prevent="updatePassword">
            <div class="field field--half">
              <label>
                <span>New Password</span>
                <input
                  v-model="newPassword"
                  type="password"
                  autocomplete="new-password"
                  required
                />
              </label>
            </div>
            <div class="field field--half">
              <label>
                <span>Confirm Password</span>
                <input
                  v-model="confirmPassword"
                  type="password"
                  autocomplete="new-password"
                  required
                />
              </label>
            </div>
            <div class="field">
              <button type="submit">Update Password</button>
            </div>
          </form>
        </section>
        <section class="fields">
          <h1>Outlook Calendar Account</h1>
          <div :key="calendarEmail">
            <div v-if="calendarEmail" class="field field--half">
              <label>
                <!-- onload="getEmail()"-->
                <span id="email">Email: {{ calendarEmail }}</span>
              </label>
              <button type="submit" @click="signOutB">Sign Out</button>
            </div>
            <div v-else class="field field--half">
              <button type="submit" @click="signInB">Sign In</button>
            </div>
          </div>
        </section>
      </div>
    </div>
  </div>
</template>

<script>
import AV from "leancloud-storage";
import { signIn, signOut, getEmail } from "../services/auth";
export default {
  name: "SettingsPage",
  data() {
    return {
      editing: false,
      fullName: "",
      email: "",
      mobilePhoneNumber: "",
      newPassword: "",
      confirmPassword: "",
      calendarEmail: false,
    };
  },
  created() {
    const vm = this;
    vm.editing = vm.isNew;
    vm.fullName = AV.User.current().get("fullName");
    vm.email = AV.User.current().get("email");
    vm.mobilePhoneNumber = AV.User.current().get("mobilePhoneNumber");
    vm.calendarEmail = getEmail();
  },
  methods: {
    saveChanges() {
      const vm = this;
      AV.User.current()
        .set("fullName", vm.fullName)
        .setEmail(vm.email)
        .setUsername(vm.email)
        .setMobilePhoneNumber(
          !vm.mobilePhoneNumber.startsWith("+")
            ? `+1${vm.mobilePhoneNumber}`
            : vm.mobilePhoneNumber
        )
        .save()
        .then(() => {
          vm.editing = false;
          alert("Profile saved.");
        })
        .catch((error) => {
          if (error.code === 125) {
            alert(
              "The email address you entered is not a valid one. Please check your input."
            );
          } else if (error.code === 127) {
            alert(
              "The phone number you entered is not a valid one (non-US number should start with a plus sign). Please check your input."
            );
          } else if (error.code === 202 || error.code === 203) {
            alert(
              "The email address you entered is already used for another account."
            );
          } else if (error.code === 214) {
            alert(
              "The phone number you entered is already used for another account."
            );
          } else {
            alert(error);
          }
        });
    },

    updatePassword() {
      const vm = this;
      if (vm.newPassword !== vm.confirmPassword) {
        alert("The passwords you entered did not match.");
      } else {
        AV.User.current()
          .set("password", vm.newPassword)
          .save()
          .then(() => {
            alert(
              "Your password has been changed! Please log in again with your new password."
            );
            vm.$router.push("/");
          })
          .catch((error) => {
            alert(error);
          });
      }
    },
    signOutB() {
      const vm = this;
      vm.calendarEmail = false;
      AV.User.current()
        .set("calendarAccSignedIn", false)
        .save();
      signOut();
      //update boolean in leancloud
    },
    async signInB() {
      const vm = this;
      const response = await signIn();
      vm.calendarEmail = response;
      AV.User.current()
        .set("calendarAccSignedIn", true)
        .save();
      //update boolean in leancloud
    },
  },
};
</script>

<style scoped>
#email {
  padding-bottom: 15px;
}
</style>
