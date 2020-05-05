<template>
  <section class="fields">
    <h1>Preferences</h1>
    <p><br>
    <table>
      <tr>
        <td style="text-align:center">
          <button @click="show('fNd')" style="width: 250px; height: 250px;">
            <font-awesome-icon :icon="['fas', 'hamburger']" size="10x" color="skyblue" opacity="0.7"/>
            <p>Food & Drinks Preferences</p>
          </button>
          <div class="field">
            <modal aria-expanded="true" name='fNd'>
              <div id="needb" class="field">
                <h1>
                  Food & Drinks Preferences
                </h1>
                <textarea rows="10"></textarea>
              </div>
            </modal>
          </div>
        </td>
        <td style="text-align:center">
          <button @click="show('busiGNI')" style="width: 250px; height: 250px;">
            <font-awesome-icon :icon="['fas', 'city']" size="10x" color="skyblue" opacity="0.7"/>
            <p>Business Goals & Interests</p>
          </button>
          <div class="field">
            <modal name='busiGNI'>
              <div id="needb" class="field">
                <h1>
                  Business Goals & Interests
                </h1>
                <textarea rows="10"></textarea>
              </div>
            </modal>
          </div>
        </td>
        <td style="text-align:center">
          <button @click="show('family')" style="width: 250px; height: 250px;">
            <font-awesome-icon :icon="['fas', 'home']" size="10x" color="skyblue" opacity="0.7"/>
            <p>Family</p>
          </button>
          <div class="field">
            <modal name='family'>
              <div id="needb" class="field">
                <h1>
                  Family
                </h1>
                <textarea rows="10"></textarea>
              </div>
            </modal>
          </div>
        </td>
      </tr>
      <tr>
        <td style="text-align:center">
          <button @click="show('hobbies')" style="width: 250px; height: 250px;">
            <font-awesome-icon :icon="['fas', 'football-ball']" size="10x" color="skyblue" opacity="0.7"/>
            <p>Hobbies</p>
          </button>
          <div class="field">
            <modal name='hobbies'>
              <div id="needb" class="field">
                <h1>
                  Hobbies
                </h1>
                <textarea rows="10"></textarea>
              </div>
            </modal>
          </div>
        </td>
        <td style="text-align:center">
          <button @click="show('learningPref')" style="width: 250px; height: 250px;">
            <font-awesome-icon :icon="['fas', 'book']" size="10x" color="skyblue" opacity="0.7"/>
            <p>Learning Preferences</p>
          </button>
          <div class="field">
            <modal name='learningPref'>
              <div id="needb" class="field">
                <h1>
                  Learning Preferences
                </h1>
                <textarea rows="10"></textarea>
              </div>
            </modal>
          </div>  
        </td>
        <td style="text-align:center">
          <button @click="show('achieve')" style="width: 250px; height: 250px;">
            <font-awesome-icon :icon="['fas', 'trophy']" size="10x" color="skyblue" opacity="0.7"/>
            <p>Achievements</p>
          </button>
          <div class="field">
            <modal name='achieve'>
              <div id="needb" class="field">
                <h1>
                  Achievements
                </h1>
                <textarea rows="10"></textarea>
              </div>
            </modal>
          </div>  
        </td>
      </tr>
      <tr>
        <td style="text-align:center">
          <button @click="show('petPeeves')" style="width: 250px; height: 250px;">
            <font-awesome-icon :icon="['fas', 'exclamation-triangle']" size="10x" color="skyblue" opacity="0.7"/>
            <p>Pet Peeves</p>
          </button>
          <modal name='petPeeves'>
            <div id="needb" class="field">
              <h1>
                Pet Peeves
              </h1>
              <textarea rows="10"></textarea>
            </div>
          </modal>
        </td>
        <td style="text-align:center">
          <button @click="show('lifestyle')" style="width: 250px; height: 250px;">
            <font-awesome-icon :icon="['fas', 'umbrella-beach']" size="10x" color="skyblue" opacity="0.7"/>
            <p>Lifestyle Preferences</p>
          </button>
          <modal name='lifestyle'>
            <div id="needb" class="field">
              <h1>
                Lifestyle Preferences
              </h1>
              <textarea rows="10"></textarea>
            </div>
          </modal>
        </td>
        <td style="text-align:center">
          <button @click="show('heroes')" style="width: 250px; height: 250px;">
            <font-awesome-icon :icon="['fas', 'crown']" size="10x" color="skyblue" opacity="0.7"/>
            <p>Heroes: Personal & Business</p>
          </button>
          <modal name='heroes'>
            <div id="needb" class="field">
              <h1>
                Heroes: Personal & Business
              </h1>
              <textarea rows="10"></textarea>
            </div>
          </modal>
        </td>
      </tr>
      <tr>
        <td style="text-align:center">
          <button @click="show('personalHis')" style="width: 250px; height: 250px;">
            <font-awesome-icon :icon="['fas', 'history']" size="10x" color="skyblue" opacity="0.7"/>
            <p>Personal History</p>
          </button>
          <modal name='personalHis'>
            <div id="needb" class="field">
              <h1>
                Personal History
              </h1>
              <textarea rows="10"></textarea>
            </div>
          </modal>
        </td>
        <td style="text-align:center">
          <button @click="show('education')" style="width: 250px; height: 250px;">
            <font-awesome-icon :icon="['fas', 'graduation-cap']" size="10x" color="skyblue" opacity="0.7"/>
            <p>Education</p>
          </button>
          <modal name='education'>
            <div id="needb" class="field">
              <h1>
                Education
              </h1>
              <textarea rows="10"></textarea>
            </div>
          </modal>
        </td>
        <td style="text-align:center">
          <button @click="show('others')" style="width: 250px; height: 250px;">
            <font-awesome-icon :icon="['fas', 'clipboard']" size="10x" color="skyblue" opacity="0.7"/>
            <p>Other Notes</p>
          </button>
          <modal name='others'>
            <div id="needb" class="field">
              <h1>
                Other Notes
              </h1>
              <textarea rows="10"></textarea>
            </div>
          </modal>
        </td>
      </tr>
    </table>
    </p>
    <div class="field">
      <button @click="show">
        Add Categories
      </button>
    </div>
    <div class="field">
      <modal name="addCategory">
        tba
      </modal>
    </div>
  </section>
</template>


<script>
import AV from "leancloud-storage";
import Vue      from 'vue'
import Popover  from 'vue-js-popover'
import VModal from 'vue-js-modal'

Vue.use(VModal)
Vue.use(Popover)

export default {
  name: "ClientPreferences",
  props: {
    pref: AV.Object,
    isNew: Boolean,
    callback: Function
  },
  data() {
    return {
      editing: false,
      allergies: "",
      foodNDrinks: "",
      busiGNI: "",
      family: "",
      hobbies: "",
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
    vm.allergies = vm.pref.get("allergies");
    vm.favSnack = vm.pref.get("favouriteSnacks")
    ///vm.busiGNI = vm.pref.get("busiGNI");
    ///vm.family = vm.pref.get("family");
    ///vm.hobbies = vm.pref.get("hobbies");
    ///vm.learningPref = vm.pref.get("learningPref");
    ///vm.achievements = vm.pref.get("achievements");
    ///vm.petPeeves = vm.pref.get("petPeeves");
    ///vm.lifestylePref = vm.pref.get("lifestylePref");
    ///vm.heroes = vm.pref.get("heroes");
    ///vm.personalHis = vm.pref.get("personalHis");
    ///vm.education = vm.pref.get("education");
    ///vm.others = vm.pref.get("others");
  },

  methods: {
    show (id) {
      this.$modal.show(id);
    },
    
    hide (id) {
      this.$modal.hide(id);
    },

    go() {
      const vm = this;
      vm.pref
        .set("allergies",vm.allergies)
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
    }

</script>







<style>

#needb {
  width: 94%;
  margin-left: 20px;
  padding: 0;
}
  
 
</style>