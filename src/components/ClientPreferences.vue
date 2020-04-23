<template>
  <section class="fields">
    <h1>Preferences</h1>
    <p><br>
    <table>
      <tr>
        <td style="text-align:center">
          <button v-popover:foodNDrinks style="width: 250px; height: 250px;">
            <font-awesome-icon :icon="['fas', 'hamburger']" size="10x" color="skyblue" opacity="0.7"/>
            <p>Food & Drinks Preferences</p>
          </button>
          <popover name="foodNDrinks" >some data</popover>
        </td>
        <td style="text-align:center">
          <button v-popover:busiGNI style="width: 250px; height: 250px;">
            <font-awesome-icon :icon="['fas', 'city']" size="10x" color="skyblue" opacity="0.7"/>
            <p>Business Goals & Interests</p>
          </button>
          <popover name="busiGNI" triggers="hover" placement="bottom">some kind of data</popover>
        </td>
        <td style="text-align:center">
          <button v-popover:family style="width: 250px; height: 250px;">
            <font-awesome-icon :icon="['fas', 'home']" size="10x" color="skyblue" opacity="0.7"/>
            <p>Family</p>
          </button>
          <popover name="family" triggers="hover" placement="bottom">some kind of data</popover>
        </td>
      </tr>
      <tr>
        <td style="text-align:center">
          <button v-popover:hobbies style="width: 250px; height: 250px;">
            <font-awesome-icon :icon="['fas', 'football-ball']" size="10x" color="skyblue" opacity="0.7"/>
            <p>Hobbies</p>
          </button>
          <popover name="hobbies" triggers="hover" placement="bottom">some kind of data</popover>  
        </td>
        <td style="text-align:center">
          <button v-popover:learningPref style="width: 250px; height: 250px;">
            <font-awesome-icon :icon="['fas', 'book']" size="10x" color="skyblue" opacity="0.7"/>
            <p>Learning Preferences</p>
          </button>
          <popover name="learningPref" triggers="hover" placement="bottom">some kind of data</popover>  
        </td>
        <td style="text-align:center">
          <button v-popover:achievements style="width: 250px; height: 250px;">
            <font-awesome-icon :icon="['fas', 'trophy']" size="10x" color="skyblue" opacity="0.7"/>
            <p>Achievements</p>
          </button>
          <popover name="achievements" triggers="hover" placement="bottom">some kind of data</popover>
        </td>
      </tr>
      <tr>
        <td style="text-align:center">
          <button v-popover:petPeeves style="width: 250px; height: 250px;">
            <font-awesome-icon :icon="['fas', 'exclamation-triangle']" size="10x" color="skyblue" opacity="0.7"/>
            <p>Pet Peeves</p>
          </button>
          <popover name="petPeeves" triggers="hover" placement="bottom">some kind of data</popover>
        </td>
        <td style="text-align:center">
          <button v-popover:lifestylePref style="width: 250px; height: 250px;">
            <font-awesome-icon :icon="['fas', 'umbrella-beach']" size="10x" color="skyblue" opacity="0.7"/>
            <p>Lifestyle Preferences</p>
          </button>
          <popover name="lifestylePref" triggers="hover" placement="bottom">some kind of data</popover>
        </td>
        <td style="text-align:center">
          <button v-popover:heroes style="width: 250px; height: 250px;">
            <font-awesome-icon :icon="['fas', 'crown']" size="10x" color="skyblue" opacity="0.7"/>
            <p>Heroes: Personal & Business</p>
          </button>
          <popover name="heroes" triggers="hover" placement="bottom">some kind of data</popover>
        </td>
      </tr>
      <tr>
        <td style="text-align:center">
          <button v-popover:personalHis style="width: 250px; height: 250px;">
            <font-awesome-icon :icon="['fas', 'history']" size="10x" color="skyblue" opacity="0.7"/>
            <p>Personal History</p>
          </button>
          <popover name="personalHis" triggers="hover" placement="bottom">some kind of data</popover>
        </td>
        <td style="text-align:center">
          <button v-popover:education style="width: 250px; height: 250px;">
            <font-awesome-icon :icon="['fas', 'graduation-cap']" size="10x" color="skyblue" opacity="0.7"/>
            <p>Education</p>
          </button>
          <popover name="education" triggers="hover" placement="bottom">some kind of data</popover>
        </td>
        <td style="text-align:center">
          <button v-popover:others style="width: 250px; height: 250px;">
            <font-awesome-icon :icon="['fas', 'clipboard']" size="10x" color="skyblue" opacity="0.7"/>
            <p>Other Notes</p>
          </button>
          <popover name="others" triggers="hover" placement="bottom">some kind of data</popover>
        </td>
      </tr>
    </table>
    </p>
  </section>
</template>


<script>
import AV from "leancloud-storage";
import Vue      from 'vue'
import Popover  from 'vue-js-popover'
 
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
      fullName: "",
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
    vm.fetchPref();
    ///vm.foodNDrinks = vm.pref.get("foodNDrinks");
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
    fetchPref() {
      const vm = this;
      const prefQuery = new AV.Query("Preferences");
      prefQuery
        .equalTo(
          "client",
          AV.Object.createWithoutData("Client", vm.$route.params.id)
        )
        .equalTo("foodNDrinks",vm.foodNDrinks)
        .include("client")
        .limit(1000)
        .find()
        .then(vm.pref.get("foodNDrinks"))
        }

      }
    }

</script>







<style>
  
  
  #overlay {
  position: fixed; /* Sit on top of the page content */
  display: none; /* Hidden by default */
  width: 100%; /* Full width (cover the whole page) */
  height: 100%; /* Full height (cover the whole page) */
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background-color: rgba(0,0,0,0.5); /* Black background with opacity */
  z-index: 2; /* Specify a stack order in case you're using a different order for other elements */
  cursor: pointer; /* Add a pointer on hover */
}

</style>