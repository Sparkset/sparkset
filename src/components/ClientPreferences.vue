<template>
  <section class="fields">
    <h1>Preferences</h1>
    <p><br /></p>
    <table>
      <tr>
        <td style="text-align:center">
          <form @submit.prevent="go">
            <button @click="show('fNd')" style="width: 250px; height: 250px;">
              <img src="@/assets/pref_food.png" alt="Food and Drink" />
              <p>Food & Drinks Preferences</p>
            </button>
            <div class="field">
              <modal height="auto" name="fNd" v-bind:scrollable="true">
                <div id="needb" class="field">
                  <h1>
                    Food & Drinks Preferences
                  </h1>
                  <p>Allergies:</p>
                  <textarea rows="3" v-model="allergies"></textarea>
                  <p>Favorite Restaurants</p>
                  <textarea rows="3" v-model="restaurants"></textarea>
                  <p>Favorite Drinks</p>
                  <textarea rows="3" v-model="drinks"></textarea>
                  <p>Favorite Food / Snacks</p>
                  <textarea rows="3" v-model="food"></textarea>
                  <p>Others</p>
                  <textarea rows="3" v-model="fOthers"></textarea>
                </div>
                <div id="needb" class="field">
                  <button type="submit" class="primary" @click="editing = true, hide2('fNd')">
                    Save
                  </button>
                  <button type="button" class="close" @click="hide('fNd')">
                    Cancel
                  </button>
                </div>
              </modal>
            </div>
          </form>
        </td>
        <td style="text-align:center">
          <form @submit.prevent="go">
            <button
              @click="show('busiGNI')"
              style="width: 250px; height: 250px;"
            >
              <img src="@/assets/pref_goals.png" alt="Business Goals and Interests" />
              <p>Business Goals & Interests</p>
            </button>
            <div class="field">
              <modal height="auto" name="busiGNI">
                <div id="needb" class="field">
                  <h1>
                    Business Goals & Interests
                  </h1>
                  <p>Goals</p>
                  <textarea rows="10" v-model="busiG"></textarea>
                  <p>Interests</p>
                  <textarea rows="10" v-model="busiI"></textarea>
                </div>
                <div id="needb" class="field">
                  <button type="submit" class="primary" @click="editing = true, hide2('busiGNI')">
                    Save
                  </button>
                  <button type="button" class="close" @click="hide('busiGNI')">
                    Cancel
                  </button>
                </div>
              </modal>
            </div>
          </form>
        </td>
        <td style="text-align:center">
          <form @submit.prevent="go">
            <button @click="show('f&f')" style="width: 250px; height: 250px;">
              <img src="@/assets/pref_home.png" alt="Family and Friends" />
              <p>Family & Friends</p>
            </button>
            <div class="field">
              <modal height="auto" name="f&f">
                <div id="needb" class="field">
                  <h1>
                    Family & Friends
                  </h1>
                  <p>Family</p>
                  <textarea rows="10" v-model="family"></textarea>
                  <p>Friends</p>
                  <textarea rows="10" v-model="friends"></textarea>
                </div>
                <div id="needb" class="field">
                  <button type="submit" class="primary" @click="editing = true, hide2('f&f')">
                    Save
                  </button>
                  <button type="button" class="close" @click="hide('f&f')">
                    Cancel
                  </button>
                </div>
              </modal>
            </div>
          </form>
        </td>
      </tr>
      <tr>
        <td style="text-align:center">
          <form @submit.prevent="go">
            <button
              @click="show('hobbies')"
              style="width: 250px; height: 250px;"
            >
              <img src="@/assets/pref_hobby.png" alt="Hobbies" />
              <p>Hobbies</p>
            </button>
            <div class="field">
              <modal height="auto" name="hobbies" v-bind:scrollable="true">
                <div id="needb" class="field">
                  <h1>
                    Hobbies
                  </h1>
                  <p>Sports</p>
                  <textarea rows="10" v-model="sports"></textarea>
                  <p>Skills</p>
                  <textarea rows="10" v-model="skills"></textarea>
                  <p>Others</p>
                  <textarea rows="10" v-model="hOthers"></textarea>
                </div>
                <div id="needb" class="field">
                  <button type="submit" class="primary" @click="editing = true, hide2('hobbies')">
                    Save
                  </button>
                  <button type="button" class="close" @click="hide('hobbies')">
                    Cancel
                  </button>
                </div>
              </modal>
            </div>
          </form>
        </td>
        <td style="text-align:center">
          <form @submit.prevent="go">
            <button
              @click="show('learningPref')"
              style="width: 250px; height: 250px;"
            >
              <img src="@/assets/pref_learn.png" alt="Learning Preferences" />
              <p>Learning Preferences</p>
            </button>
            <div class="field">
              <modal height="auto" name="learningPref">
                <div id="needb" class="field">
                  <h1>
                    Learning Preferences
                  </h1>
                  <textarea rows="10" v-model="learningPref"></textarea>
                </div>
                <div id="needb" class="field">
                  <button type="submit" class="primary" @click="editing = true, hide2('learningPref')">
                    Save
                  </button>
                  <button type="button" class="close" @click="hide('learningPref')">
                    Cancel
                  </button>
                </div>
              </modal>
            </div>
          </form>
        </td>
        <td style="text-align:center">
          <form @submit.prevent="go">
            <button
              @click="show('achieve')"
              style="width: 250px; height: 250px;"
            >
              <img src="@/assets/pref_achieve.png" alt="Achievements" />
              <p>Achievements</p>
            </button>
            <div class="field">
              <modal height="auto" name="achieve">
                <div id="needb" class="field">
                  <h1>
                    Achievements
                  </h1>
                  <textarea rows="10" v-model="achievements"></textarea>
                </div>
                <div id="needb" class="field">
                  <button type="submit" class="primary" @click="editing = true, hide2('achieve')">
                    Save
                  </button>
                  <button type="button" class="close" @click="hide('achieve')">
                    Cancel
                  </button>
                </div>
              </modal>
            </div>
          </form>
        </td>
      </tr>
      <tr>
        <td style="text-align:center">
          <form @submit.prevent="go">
            <button
              @click="show('petPeeves')"
              style="width: 250px; height: 250px;"
            >
              <img src="@/assets/pref_peeve.png" alt="Pet Peeves" />
              <p>Pet Peeves</p>
            </button>
            <div class="field">
              <modal height="auto" name="petPeeves">
                <div id="needb" class="field">
                  <h1>
                    Pet Peeves
                  </h1>
                  <textarea rows="10" v-model="petPeeves"></textarea>
                </div>
                <div id="needb" class="field">
                  <button type="submit" class="primary" @click="editing = true, hide2('petPeeves')">
                    Save
                  </button>
                  <button type="button" class="close" @click="hide('petPeeves')">
                    Cancel
                  </button>
                </div>
              </modal>
            </div>
          </form>
        </td>
        <td style="text-align:center">
          <form @submit.prevent="go">
            <button
              @click="show('lifestyle')"
              style="width: 250px; height: 250px;"
            >
              <img src="@/assets/pref_life.png" alt="Lifestyle" />
              <p>Lifestyle Preferences</p>
            </button>
            <div class="field">
              <modal height="auto" name="lifestyle">
                <div id="needb" class="field">
                  <h1>
                    Lifestyle Preferences
                  </h1>
                  <textarea rows="10" v-model="lifestylePref"></textarea>
                </div>
                <div id="needb" class="field">
                  <button type="submit" class="primary" @click="editing = true, hide2('lifestyle')">
                    Save
                  </button>
                  <button type="button" class="close" @click="hide('lifestyle')">
                    Cancel
                  </button>
                </div>
              </modal>
            </div>
          </form>
        </td>
        <td style="text-align:center">
          <form @submit.prevent="go">
            <button
              @click="show('heroes')"
              style="width: 250px; height: 250px;"
            >
              <img src="@/assets/pref_hero.png" alt="Heroes" />
              <p>Heroes: Personal & Business</p>
            </button>
            <div class="field">
              <modal height="auto" name="heroes">
                <div id="needb" class="field">
                  <h1>
                    Heroes: Personal & Business
                  </h1>
                  <textarea rows="10" v-model="heroes"></textarea>
                </div>
                <div id="needb" class="field">
                  <button type="submit" class="primary" @click="editing = true, hide2('heroes')">
                    Save
                  </button>
                  <button type="button" class="close" @click="hide('heroes')">
                    Cancel
                  </button>
                </div>
              </modal>
            </div>
          </form>
        </td>
      </tr>
      <tr>
        <td style="text-align:center">
          <form @submit.prevent="go">
            <button
              @click="show('personalHis')"
              style="width: 250px; height: 250px;"
            >
              <img src="@/assets/pref_history.png" alt="Personal History" />
              <p>Personal History</p>
            </button>
            <div class="field">
              <modal height="auto" name="personalHis">
                <div id="needb" class="field">
                  <h1>
                    Personal History
                  </h1>
                  <textarea rows="10" v-model="personalHis"></textarea>
                </div>
                <div id="needb" class="field">
                  <button type="submit" class="primary" @click="editing = true, hide2('personalHis')">
                    Save
                  </button>
                  <button type="button" class="close" @click="hide('personalHis')">
                    Cancel
                  </button>
                </div>
              </modal>
            </div>
          </form>
        </td>
        <td style="text-align:center">
          <form @submit.prevent="go">
            <button
              @click="show('education')"
              style="width: 250px; height: 250px;"
            >
              <img src="@/assets/pref_educ.png" alt="Education" />
              <p>Education</p>
            </button>
            <div class="field">
              <modal height="auto" name="education">
                <div id="needb" class="field">
                  <h1>
                    Education
                  </h1>
                  <textarea rows="10" v-model="education"></textarea>
                </div>
                <div id="needb" class="field">
                  <button type="submit" class="primary" @click="editing = true, hide2('education')">
                    Save
                  </button>
                  <button type="button" class="close" @click="hide('education')">
                    Cancel
                  </button>
                </div>
              </modal>
            </div>
          </form>
        </td>
        <td style="text-align:center">
          <form @submit.prevent="go">
            <button
              @click="show('others')"
              style="width: 250px; height: 250px;"
            >
              <img src="@/assets/pref_other.png" alt="Other Notes" />
              <p>Other Preferences</p>
            </button>
            <div class="field">
              <modal height="auto" name="others">
                <div id="needb" class="field">
                  <h1>
                    Other Preferences
                  </h1>
                  <textarea rows="10" v-model="others"></textarea>
                </div>
                <div id="needb" class="field">
                  <button type="submit" class="primary" @click="editing = true, hide2('others')">
                    Save
                  </button>
                  <button type="button" class="close" @click="hide('others')">
                    Cancel
                  </button>
                </div>
              </modal>
            </div>
          </form>
        </td>
      </tr>
    </table>
  </section>
</template>

<script>
import AV from "leancloud-storage";
import Vue from "vue";
import VModal from "vue-js-modal";

Vue.use(VModal);

export default {
  name: "ClientPreferences",
  directive: VModal,

  data() {
    return {
      editing: false,
      pref: new AV.Object("Client"),
      food: "",
      allergies: "",
      drinks: "",
      restaurants: "",
      fOthers: "",
      busiG: "",
      busiI: "",
      family: "",
      friends: "",
      sports: "",
      skills: "",
      hOthers: "",
      learningPref: "",
      achievements: "",
      petPeeves: "",
      lifestylePref: "",
      heroes: "",
      personalHis: "",
      education: "",
      others: ""
    };
  },

  created() {
    const vm = this;
    const prefQuery = new AV.Query("Client");
    prefQuery
      .get(vm.$route.params.id)
      .then(pref => {
        vm.pref = pref;
      })
      .catch(error => {
        alert(error);
      });
  },

  methods: {
    show(id) {
      const vm = this;
      this.$modal.show(id);
      if (id == "fNd") {
        vm.allergies = vm.pref.get("P_allergies");
        vm.drinks = vm.pref.get("P_drinks");
        vm.restaurants = vm.pref.get("P_restaurants");
        vm.food = vm.pref.get("P_food");
        vm.fOthers = vm.pref.get("P_fOthers");
      } else if (id == "busiGNI") {
        vm.busiG = vm.pref.get("P_busiG");
        vm.busiI = vm.pref.get("P_busiI");
      } else if (id == "f&f") {
        vm.family = vm.pref.get("P_family");
        vm.friends = vm.pref.get("P_friends");
      } else if (id == "hobbies") {
        vm.sports = vm.pref.get("P_sports");
        vm.skills = vm.pref.get("P_skills");
        vm.hOthers = vm.pref.get("P_hOthers");
      } else if (id == "learningPref") {
        vm.learningPref = vm.pref.get("P_learningPref");
      } else if (id == "achievements") {
        vm.achievements = vm.pref.get("P_achievements");
      } else if (id == "petPeeves") {
        vm.petPeeves = vm.pref.get("P_petPeeves");
      } else if (id == "lifestylePref") {
        vm.lifestylePref = vm.pref.get("P_lifestylePref");
      } else if (id == "heroes") {
        vm.heroes = vm.pref.get("P_heroes");
      } else if (id == "personalHis") {
        vm.personalHis = vm.pref.get("P_personalHis");
      } else if (id == "education") {
        vm.education = vm.pref.get("P_education");
      } else if (id == "others") {
        vm.others = vm.pref.get("P_others");
      }
    },

    hide(id) {
      this.$modal.hide(id);
    },

    hide2(id){
      alert("Preferences updated");
      this.$modal.hide(id);
    },

    go() {
      const vm = this;
      vm.pref
        .set("P_allergies", vm.allergies)
        .set("P_food", vm.food)
        .set("P_drinks", vm.drinks)
        .set("P_restaurants", vm.restaurants)
        .set("P_fOthers", vm.fOthers)
        .set("P_busiG", vm.busiG)
        .set("P_busiI", vm.busiI)
        .set("P_family", vm.family)
        .set("P_friends", vm.friends)
        .set("P_sports", vm.sports)
        .set("P_skills", vm.skills)
        .set("P_hOthers", vm.hOthers)
        .set("P_learningPref", vm.learningPref)
        .set("P_achievements", vm.achievements)
        .set("P_petPeeves", vm.petPeeves)
        .set("P_lifestylePref", vm.lifestylePref)
        .set("P_heroes", vm.heroes)
        .set("P_personalHis", vm.personalHis)
        .set("P_education", vm.education)
        .set("P_others", vm.others)
        .save()
        .then(() => {
          if (vm.editing == true) {
          /** alert("Preferences updated"); **/
          }
          vm.editing = false;
        })
        .catch(error => {
          alert(error);
        });
    }
  }
};
</script>

<style>
#needb {
  width: 94%;
  margin-left: 20px;
  padding: 0;
}
</style>
