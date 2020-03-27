<template>
  <div>
    <div class="column">
      <div class="card">
        <section class="fields">
          <h1>Basic Information</h1>
          <form @submit.prevent="saveChanges">
            <div class="field field--half">
              <label>
                <span>Full Name</span>
                <input
                  v-model="pendingChanges.fullName"
                  type="text"
                  autocomplete="name"
                  required
                />
              </label>
            </div>
            <div class="field field--half">
              <label>
                <span>Email</span>
                <input
                  v-model="pendingChanges.email"
                  type="email"
                  autocomplete="email"
                  required
                />
              </label>
            </div>
            <div class="field field--half">
              <label>
                <span>Phone Number</span>
                <input
                  v-model="pendingChanges.mobilePhoneNumber"
                  type="tel"
                  autocomplete="tel"
                  required
                />
              </label>
            </div>
            <div class="field">
              <button type="submit" class="primary">Save Changes</button>
            </div>
          </form>
        </section>
        <section class="fields">
          <h1>Change Password</h1>
          <form @submit.prevent="updatePassword">
            <div class="field field--half">
              <label>
                <span>New Password</span>
                <input
                  v-model="pendingChanges.newPassword"
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
                  v-model="pendingChanges.confirmPassword"
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
        <section class="fields" v-if="includeAddUserTemplate">
          <h1>Add New User</h1>
          <form @submit.prevent="addNewUser">
            <div class="field field--half">
              <label>
                <span>Email Address</span>
                <input
                  v-model="pendingChanges.newEmailAddress"
                  type="email"
                  required
                />
              </label>
            </div>
            <div class="field field--half">
              <label>
                <span>Password</span>
                <input
                  v-model="pendingChanges.newUserPassword"
                  type="password"
                  autocomplete="new-user-password"
                  required
                />
              </label>
            </div>
            <div class="field field--half">
              <label>
                <span>Full Name</span>
                <input
                  v-model="pendingChanges.newFullName"
                  type="text"
                  autocomplete="name"
                  required
                />
              </label>
            </div>
            <div class="field field--half">
              <label>
                <span>Phone Number</span>
                <input
                  v-model="pendingChanges.newPhoneNumber"
                  type="tel"
                  autocomplete="tel"
                  required
                />
              </label>
            </div>
            <div class="field field--half">
              <toggle-button
                :value="false"
                :color="{
                  checked: '#00FF00',
                  unchecked: '#FF0000',
                  disabled: '#CCCCCC'
                }"
                :labels="{
                  checked: 'Give ability to add users',
                  unchecked: 'Do not give ability to add users'
                }"
                :width="250"
                :height="35"
                :font-size="12"
                @change="changeUserCreationPermission"
              />
            </div>
            <div class="field">
              <button type="submit">Add New User</button>
            </div>
          </form>
        </section>
        <section class="fields" v-else>
          <h1>Add New User</h1>
          <h4>
            Current account does not have access to adding new users. Please
            contact system administrator.
          </h4>
        </section>
      </div>
    </div>
  </div>
</template>

<script>
import AV from "leancloud-storage";
export default {
  name: "SettingsPage",
  data() {
    return {
      pendingChanges: {
        fullName: "",
        email: "",
        mobilePhoneNumber: "",
        newPassword: "",
        confirmPassword: "",
        newEmailAddress: "",
        newPhoneNumber: "",
        newUserPassword: "",
        newFullName: "",
        allowCreationOfNewUsers: false
      },
      includeAddUserTemplate: false
    };
  },
  created() {
    const vm = this;
    vm.pendingChanges.fullName = AV.User.current().get("fullName");
    vm.pendingChanges.email = AV.User.current().get("email");
    vm.pendingChanges.mobilePhoneNumber = AV.User.current().get(
      "mobilePhoneNumber"
    );
    vm.includeAddUserTemplate = AV.User.current().get("addNewUsers");
  },
  methods: {
    saveChanges() {
      const vm = this;
      AV.User.current()
        .set("fullName", vm.pendingChanges.fullName)
        .set("email", vm.pendingChanges.email)
        .set("username", vm.pendingChanges.email)
        .set(
          "mobilePhoneNumber",
          vm.pendingChanges.mobilePhoneNumber &&
            !vm.pendingChanges.mobilePhoneNumber.startsWith("+")
            ? `+1${vm.pendingChanges.mobilePhoneNumber}`
            : vm.pendingChanges.mobilePhoneNumber
        )
        .save()
        .then(() => {
          alert("Profile saved.");
        })
        .catch(error => {
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
      if (vm.pendingChanges.newPassword !== vm.pendingChanges.confirmPassword) {
        alert("The passwords you entered did not match.");
      } else {
        AV.User.current()
          .set("password", vm.pendingChanges.newPassword)
          .save()
          .then(() => {
            alert(
              "Your password has been changed! Please log in again with your new password."
            );
            vm.$router.push("/");
          })
          .catch(error => {
            alert(error);
          });
      }
    },
    addNewUser() {
      const vm = this;
      const user = new AV.User();
      user
        .setUsername(vm.pendingChanges.newEmailAddress)
        .setPassword(vm.pendingChanges.newUserPassword)
        .setEmail(vm.pendingChanges.newEmailAddress)
        .setMobilePhoneNumber(vm.pendingChanges.newPhoneNumber)
        .set("fullName", vm.pendingChanges.newFullName)
        .set("addNewUsers", vm.pendingChanges.allowCreationOfNewUsers)
        .signUp()
        .then(function() {
          alert(
            `User Created with email address: ${vm.pendingChanges.newEmailAddress}.`
          );
        })
        .catch(function(error) {
          alert(error);
        });
    },
    changeUserCreationPermission(value) {
      const vm = this;
      vm.pendingChanges.allowCreationOfNewUsers = value["value"];
    }
  }
};
</script>

<style scoped></style>
