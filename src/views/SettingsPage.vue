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
      </div>
      <div class="card">
        <section class="fields" v-if="allowAddingNewUsers">
          <h1>Add New User</h1>
          <form @submit.prevent="addNewUser">
            <div class="field field--half">
              <label>
                <span>Full Name</span>
                <input v-model="newUser.fullName" type="text" required />
              </label>
            </div>
            <div class="field field--half">
              <label>
                <span>Email</span>
                <input v-model="newUser.email" type="email" required />
              </label>
            </div>
            <div class="field field--half">
              <label>
                <span>Phone Number</span>
                <input
                  v-model="newUser.mobilePhoneNumber"
                  type="tel"
                  required
                />
              </label>
            </div>
            <div class="field field--half">
              <label>
                <span>Password</span>
                <input v-model="newUser.password" type="password" required />
              </label>
            </div>
            <div class="field field--half">
              <toggle-button
                :value="false"
                :color="{
                  checked: '#36d5d8',
                  unchecked: '#e52f2e'
                }"
                :labels="{
                  checked: 'Allow adding users',
                  unchecked: 'Disallow adding users'
                }"
                :width="175"
                :height="35"
                :font-size="12"
                @change="changeUserCreationPermission"
              />
            </div>
            <div class="field">
              <button type="submit" class="primary">Add New User</button>
            </div>
          </form>
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
        confirmPassword: ""
      },
      allowAddingNewUsers: false,
      newUser: {
        fullName: "",
        email: "",
        mobilePhoneNumber: "",
        password: "",
        allowAddingNewUsers: false
      }
    };
  },
  created() {
    const vm = this;
    vm.pendingChanges.fullName = AV.User.current().get("fullName");
    vm.pendingChanges.email = AV.User.current().get("email");
    vm.pendingChanges.mobilePhoneNumber = AV.User.current().get(
      "mobilePhoneNumber"
    );
    vm.allowAddingNewUsers = AV.User.current().get("allowAddingNewUsers");
  },
  methods: {
    saveChanges() {
      const vm = this;
      AV.User.current()
        .set("fullName", vm.pendingChanges.fullName)
        .setEmail(vm.pendingChanges.email)
        .setUsername(vm.pendingChanges.email)
        .setMobilePhoneNumber(
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
        .set("fullName", vm.newUser.fullName)
        .setEmail(vm.newUser.email)
        .setUsername(vm.newUser.email)
        .setMobilePhoneNumber(
          !vm.newUser.mobilePhoneNumber.startsWith("+")
            ? `+1${vm.newUser.mobilePhoneNumber}`
            : vm.newUser.mobilePhoneNumber
        )
        .setPassword(vm.newUser.password)
        .set("allowAddingNewUsers", vm.newUser.allowAddingNewUsers)
        .signUp()
        .then(() => {
          alert(`User Created with email address: ${vm.newUser.email}.`);
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
    changeUserCreationPermission(value) {
      const vm = this;
      vm.newUser.allowAddingNewUsers = value["value"];
    }
  }
};
</script>

<style scoped></style>
