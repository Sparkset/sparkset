<template>
  <div>
    <div class="columns">
      <div class="column">
        <div class="card">
          <section class="fields">
            <h1>Basic Information</h1>
            <form @submit.prevent="saveChanges">
              <div class="field field--half">
                <label>
                  <span>First Name</span>
                  <input
                    v-model="pendingChanges.firstName"
                    type="text"
                    autocomplete="given-name"
                    required
                  />
                </label>
              </div>
              <div class="field field--half">
                <label>
                  <span>Last Name</span>
                  <input
                    v-model="pendingChanges.lastName"
                    type="text"
                    autocomplete="family-name"
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
        firstName: "",
        lastName: "",
        email: "",
        newPassword: "",
        confirmPassword: ""
      }
    };
  },
  created() {
    const vm = this;
    vm.pendingChanges.firstName = AV.User.current().get("firstName");
    vm.pendingChanges.lastName = AV.User.current().get("lastName");
    vm.pendingChanges.email = AV.User.current().get("email");
  },
  methods: {
    saveChanges() {
      const vm = this;
      AV.User.current()
        .set("firstName", vm.pendingChanges.firstName)
        .set("lastName", vm.pendingChanges.lastName)
        .set("email", vm.pendingChanges.email)
        .set("username", vm.pendingChanges.email)
        .save()
        .then(() => {
          alert("Profile saved.");
        })
        .catch(error => {
          if (error.code === 125) {
            alert(
              "The email address you entered is not a valid one. Please check your input."
            );
          } else if (error.code === 203) {
            alert(
              "The email address you entered is already used for another account."
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
    }
  }
};
</script>

<style scoped></style>
