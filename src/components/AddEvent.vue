<template>
  <form @submit.prevent="createEvent">
    <h1 id="customEvent">Create Custom Event</h1>
    <div class="field field--half">
      <label>
        <span class="required-field">Name</span>
        <input type="text" v-model="newEvent.name" required />
      </label>
    </div>
    <div class="field field--half">
      <label>
        <span class="required-field">Date</span>
        <input type="date" max="2099-12-31" v-model="newEvent.date" required />
      </label>
    </div>
    <div class="field field--half">
      <label>
        <span class="required-field">Start Time</span>
        <input type="time" v-model="newEvent.time" required />
      </label>
    </div>
    <div class="field field--half">
        <label>
          <span class="required-field">End Time</span>
          <input type="time" v-model="newEvent.endTime" required />
        </label>
      </div>
    <div class="field">
      <label>
        <span>Notes</span>
        <input id="eventNotes" type="text" v-model="newEvent.notes" />
      </label>
    </div>
    <div class="field field--half" id="repeat">
      <label>
        <span >Repeat</span> 
        <select v-model="newEvent.recurringEventType" >
          <option value="Never">Never</option>
          <option value="Daily">Daily</option>
          <option value="Weekly">Weekly</option>
          <option value="Monthly">Monthly</option>
          <option value="Yearly">Yearly</option>
        </select>
      </label> 
    </div>
    <div class="field field--half" id="repeatEnd" :key="newEvent.recurringEventType">
      <label v-if="newEvent.recurringEventType != 'Never'"> 
        <span class="required-field">End Repeat</span> 
        <input type="date" max="2099-12-31" v-model="newEvent.endRepeatDate" @click="changeRecurringStatus" required />
      </label> 
    </div>
    <div class="field" id="syncingToggle">
        <label>
            <span>Syncing</span>
            <toggle-button
              :value="newEvent.syncing"
              :color="{
                checked: '#36d5d8',
                unchecked: '#e52f2e'
              }"
              :labels="{
                checked: 'Yes',
                unchecked: 'No'
              }"
              :width="72"
              :height="42"
              :font-size="12"
              @change="changeSyncing"
              sync />
            </label>
    </div>
    <div class="submitForm"> 
        <div class="field" id="save">
            <button type="submit" class="primary">Save</button>
        </div>
        <div class="field" id="cancel">
            <button type="button" class="cancel" @click="cancel">Cancel</button>
        </div>
    </div>
  </form>
</template>

<script> 
// here is where it starts 
import {createNewEvent} from "../services/graph";
import {signIn, getEmail} from "../services/auth"; 
export default {
  name: "AddEvent",
  data() {
    return {
      newEvent: {
        name: "",
        date: "",
        time: "",
        endTime: "", 
        notes: "",
        recurringEvent: false,
        daysBetween: 1,
        recurringEventType: "", // takes in "Daily", "Weekly", "Monthly", "Yearly"
        endRepeatDate: "",
        syncing: true
      }, 
      calendarEmail: false
    };
  },
  created() {
    const vm = this;
    vm.calendarEmail = getEmail();
    vm.newEvent.recurringEventType = "Never";
  },
  methods: {
    createEvent() {
      const vm = this;
      console.log("in createEvent");//debugging press "shift + ctrl + J" to see console
      if (this.newEvent.syncing) {
        console.log("calling sync from createEvent");//debugging
        this.sync();
      }
      vm.$emit("create-event", vm.newEvent);
    },
    changeRecurringEvent(e) { //we won't end up needing this
      const vm = this;
      vm.newEvent.recurringEvent = e.value;
    },
    changeSyncing(e) {
      const vm = this;
      vm.newEvent.syncing = e.value;
    },
    cancel() {
      const vm = this;
      vm.$emit("cancel-event");
    }, 
    changeRecurringStatus() {
      const vm = this; 
      if (vm.newEvent.recurringEventType == "Daily") {
        vm.newEvent.recurringEvent = true; 
        vm.newEvent.daysBetween = 1;
        console.log("in changeRecurringStatus, daysBetween = " + vm.newEvent.daysBetween);
      }
      else if (vm.newEvent.recurringEventType == "Weekly") {
        vm.newEvent.recurringEvent = true; 
        vm.newEvent.daysBetween = 7;
        console.log("in changeRecurringStatus, daysBetween = " + vm.newEvent.daysBetween);
      }
      else if (vm.newEvent.recurringEventType == "Monthly") {
        vm.newEvent.recurringEvent = true; 
        vm.newEvent.daysBetween = 30;
        console.log("in changeRecurringStatus, daysBetween = " + vm.newEvent.daysBetween);
      }
      else if (vm.newEvent.recurringEventType == "Yearly") {
        vm.newEvent.recurringEvent = true; 
        vm.newEvent.daysBetween = 365;
        console.log("in changeRecurringStatus, daysBetween = " + vm.newEvent.daysBetween);
      }
      console.log("in changeRecurringStatus, recurringEvent = " +vm.newEvent.recurringEvent);
    },
    async sync() {
      const vm = this;
      //check here if logged in 
      if (vm.calendarEmail == false) {
        //log in first 
        const response = await signIn();
        vm.calendarEmail = response;
      }
      //call recurringsync using conditional here
      if (vm.newEvent.recurringEventType != "Never") {
        vm.recurringSync();
      }
      console.log(vm.calendarEmail);
      createNewEvent(vm.newEvent.name, vm.newEvent.date, vm.newEvent.time, vm.newEvent.endTime, vm.newEvent.notes);
    },
    recurringSync() {  
      // let async sync() do original event so this can be called from async sync()
      const vm = this; 
      let currentDate = new Date(vm.newEvent.date + "T" + vm.newEvent.time + ":00"); // original or start date given
      let endDate = new Date(vm.newEvent.endRepeatDate + "T" + vm.newEvent.time + ":00"); // end repeat date 
      
      while (currentDate < endDate) { //start date comes before end date 
        if (vm.newEvent.recurringEventType == "Daily") {   //remember to make sure recurringEvent can't be False w type being something
          //require adding days to date object 
          currentDate.setDate(currentDate.getDate() + 1);
          //check again current date is valid, don't have to do this for daily. assuming end date inclusive

          //date needs to look like this "2021-05-06"
          let formattedDate = currentDate.getFullYear().toString() + "-" + (currentDate.getMonth() + 1).toString() + "-" + currentDate.getDate().toString();
          createNewEvent(vm.newEvent.name, formattedDate, vm.newEvent.time, vm.newEvent.endTime, vm.newEvent.notes);
        }
        else if (vm.newEvent.recurringEventType == "Weekly") {
          //require adding 7 days to date object
          currentDate.setDate(currentDate.getDate() + 7);
          //check again current date is valid, don't have to do this for daily. assuming end date inclusive
          if (currentDate <= endDate) {
            //date needs to look like this "2021-05-06"
            let formattedDate = currentDate.getFullYear().toString() + "-" + (currentDate.getMonth() + 1).toString() + "-" + currentDate.getDate().toString();
            createNewEvent(vm.newEvent.name, formattedDate, vm.newEvent.time, vm.newEvent.endTime, vm.newEvent.notes);
          }
        }
        else if (vm.newEvent.recurringEventType == "Monthly") {
          //require adding a month to date object
          currentDate.setMonth(currentDate.getMonth() + 1);
          //check again current date is valid, don't have to do this for daily. assuming end date inclusive
          if (currentDate <= endDate) {
            //date needs to look like this "2021-05-06"
            let formattedDate = currentDate.getFullYear().toString() + "-" + (currentDate.getMonth() + 1).toString() + "-" + currentDate.getDate().toString();
            console.log("formattedDate: " + formattedDate);
            createNewEvent(vm.newEvent.name, formattedDate, vm.newEvent.time, vm.newEvent.endTime, vm.newEvent.notes);
          }
        }
        else { //assuming it's yearly here
          //require adding a year to date object
          currentDate.setFullYear(currentDate.getFullYear() + 1);
          //check again current date is valid, don't have to do this for daily. assuming end date inclusive
          if (currentDate <= endDate) {
            //date needs to look like this "2021-05-06"
            let formattedDate = currentDate.getFullYear().toString() + "-" + (currentDate.getMonth() + 1).toString() + "-" + currentDate.getDate().toString();
            createNewEvent(vm.newEvent.name, formattedDate, vm.newEvent.time, vm.newEvent.endTime, vm.newEvent.notes);
          }
        }
      }
    }
  }
};
</script>

<style scoped>


  .required-field::after{
    content:" *";
    color:red;
  }
  #customEvent {
    margin-top: 0;
  }

  .submitForm .field {
    float: none;
    /* display: inline-block; */
    margin-bottom: 0;
  }

  #repeat {
    margin: 0 16px 16px 0;
  }   

  #repeatEnd {
    margin: 0 0 16px 0;
  } 

  #save {
    width: auto;
    float: right;
  }

  #cancel {
    width: auto;
    float: right;
    margin-right: 21px;
  }

  #save .primary {
    width: 70px;
  }

  #cancel .primary {
    width: 70px;
  }

</style>


