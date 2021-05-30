<template>
  <div>
    <div class="column column--right">
      <div class="card">
        <section class="fields">
          <h1>Needs Attention</h1>
          <div v-if="!noData" class="field" >
            <div id="chart" >
              <apexchart type="bar" height="350" :options="chartOptions" :series="series" :key="modified"></apexchart>
            </div>
          </div>
          <div v-else>
            <p>You're all caught up!</p>
          </div>
        </section>
        <!-- <section v-else class="fields">
          <h1>You're all caught up!</h1>
        </section> -->
      </div>
      <div class="card">
        <section class="fields">
          <h1>New Clients</h1>
          <div class="field" id = "fields">
              <router-link :to= "`/client/${client.id}`" v-for="client in stats.newClients" :key="client.id" id="clientButton" tag="button">
                <div id="container" >
                    <div id="image">
                      <img
                        :src="
                          client.get('picture')
                            ? client.get('picture').url()
                            : 'https://www.gravatar.com/avatar/00000000000000000000000000000000?d=mp&f=y'
                        "
                        alt="The picture of the client."
                      />   
                    </div> 
                    <div id="client">
                      <span>{{ client.get("fullName") }}</span>
                    </div>
                </div>
              </router-link>
            <!-- </button> -->
          </div>
        </section>
      </div>
       <div class="card">
        <section class="fields">
          <h1>Data at a Glance</h1>
          <div class="field">
            <p>Clients: {{ stats.clients }}</p>
            <p>Companies: {{ stats.companies }}</p>
            <p>Events: {{ stats.events }}</p>
            <p>Memos: {{ stats.notes }}</p>
          </div>
        </section>
      </div>
      <!-- <div class="card">
        <section class="fields">
          <h1>Suggestions</h1>
          <p v-if="suggestedEvents.length">
            {{ suggestedEvents.length }}
            {{ suggestedEvents.length === 1 ? "event" : "events" }} can be
            scheduled.
          </p>
          <p v-else>You are all caught up!</p>
        </section>
        <section
          v-for="event in suggestedEvents"
          :key="event.lastEvent.id"
          class="fields"
        >
          <p>
            {{ event.event.get("name") }} with
            {{ event.event.get("client").get("fullName") }}
          </p>
          <form @submit.prevent="add(event)">
            <div class="field">
              <input
                type="date"
                max="2099-12-31"
                v-model="event.pendingChanges.date"
                required
              />
            </div>
            <div class="field">
              <input type="time" v-model="event.pendingChanges.time" required />
            </div>
            <div class="field">
              <button type="submit" class="primary">
                Add
              </button>
            </div>
            <div class="field">
              <button type="button" @click="dismiss(event)">
                Dismiss
              </button>
            </div>
          </form>
        </section>
      </div> -->
      <div class="card">
        <section class="fields">
          <h1>Events Reported</h1>
          <div class="field">
            <p>
              Events Completed:
              <span class="item-text-success">
                {{ stats.eventsCompleted }}
              </span>
            </p>
            <p>
              Events Open:
              <span class="item-text-danger">
                {{ stats.eventsOpen }}
              </span>
            </p>
          </div>
        </section>
      </div>
    </div>
    <div class="column column--left">
      <div class="card">
        <section class="fields">
          <h1>Upcoming</h1>
          <div class="field field--superwide">
            <EventsTable
              :events="upcomingEvents"
              show-client
              :fetch-events="fetchEvents"
            />
          </div>
        </section>
      </div>
      <div class="card">
        <section class="fields">
          <h1>Recent Memos</h1>
          <div class="field horizontal-items">
            <div
              v-for="note in recentNotes"
              :key="note.id"
              class="horizontal-item"
            >
              <div class="card">
                <NoteCard :note="note" />
              </div>
            </div>
          </div>
        </section>
      </div>
    </div>
  </div>
</template>

<script>
import EventsTable from "@/components/EventsTable.vue";
import NoteCard from "@/components/NoteCard.vue";
import AV from "leancloud-storage";
import VueApexCharts from 'vue-apexcharts'; 
export default {
  name: "OverviewPage",
  components: {
    apexchart: VueApexCharts,
    EventsTable,
    NoteCard
  },
  data() {
    return {
      upcomingEvents: [],
      suggestedEvents: [],
      recentNotes: [],
      clients: [],
      stats: {
        eventsCompleted: 0,
        eventsOpen: 0,
        clients: 0,
        companies: 0,
        events: 0,
        notes: 0,
        newClients: []
      },
      //doneEventData: [],
      items: [],
      modified: false,
      noData: false,
      //doneEvents: [], 
      doneEventDataMap: {},
      event: new AV.Object("Event"),
      client: new AV.Object("Client"),
      series: [{
        data: []
      }],
      chartOptions: {
        chart: {
          type: 'bar',
          height: 350
        }, 
        fill:
        {
        colors: ['#36d5d8']
        },
        plotOptions: {
          bar: {
            borderRadius: 4,
            horizontal: true,
          }
        },
        dataLabels: {
          enabled: false
        },
        noData: {
            text: 'Loading...'
        },

        yaxis: {
          show: true,
          tickAmount: 5,
          labels: {
            show: true,
            align: 'right',
            minWidth: 0,
            maxWidth: 160,
            style: {
                colors: [],
                fontSize: '12px',
                fontFamily: 'avenir next, sans-serif',
                fontWeight: 400,
                cssClass: 'apexcharts-yaxis-label',
            }
          }
        },
        xaxis: {
          type: 'category',
          categories: [],
          labels: {
            show: true,
            allowDecimals: false,
            style: {
              colors: [],
              fontSize: '13px',
              fontFamily: 'avenir next, sans-serif',
              fontWeight: 400,
              cssClass: 'apexcharts-xaxis-label',
            }
          },
          title: {
              text: "Uncompleted Events",
              offsetX: 0,
              offsetY: 0,
              style: {
                  color: undefined,
                  align: 'right',
                  fontSize: '15px',
                  fontFamily: 'avenir next, sans-serif',
                  fontWeight: 400,
                  cssClass: 'apexcharts-xaxis-title',
              }
          }
        }
      }      
    }
  },
  created() {  
    const vm = this;
    vm.fetchEvents();
    vm.fetchNotes();
    vm.sortData();
  },
  methods: {
    fetchEvents() {
      const vm = this;
      const upcomingEventQuery = new AV.Query("Event");
      upcomingEventQuery
        .equalTo("done", false)
        .notEqualTo("time", null)
        .include("client")
        .include("company")
        .ascending("time")
        .limit(10)
        .find()
        .then(upcomingEvents => {
          vm.upcomingEvents = upcomingEvents.filter(function(e) {
            return (!e.get('client').get('archived')); }).map(event => ({
              event,
              editing: false,
              pendingChanges: {
                date: `${event.get("time").getFullYear()}-${`0${event
                  .get("time")
                  .getMonth() + 1}`.slice(-2)}-${`0${event
                  .get("time")
                  .getDate()}`.slice(-2)}`,
                time: `${`0${event.get("time").getHours()}`.slice(
                  -2
                )}:${`0${event.get("time").getMinutes()}`.slice(-2)}`
              }
            }));
        })
        .catch(error => {
          // console.log("goes wrong here");
          alert(error);
        });
      const lastEventQuery = new AV.Query("Event"); //suggestions section
      lastEventQuery
        .equalTo("done", true)
        .exists("recursIn")
        .include("client")
        .notEqualTo("time", null)
        .notEqualTo("date", null)
        .ascending("time")
        .limit(1000)
        .find()
        .then(lastEvents => {
          vm.suggestedEvents = lastEvents.map(lastEvent => {
            const rawTime = new Date(
              new Date(lastEvent.get("time")).setDate(
                lastEvent.get("time").getDate() + lastEvent.get("recursIn")
              )
            );
            return {
              event: new AV.Object("Event")
                .set("name", lastEvent.get("name"))
                .set("client", lastEvent.get("client"))
                .set("recursIn", lastEvent.get("recursIn")),
              pendingChanges: {
                date: `${rawTime.getFullYear()}-${`0${rawTime.getMonth() +
                  1}`.slice(-2)}-${`0${rawTime.getDate()}`.slice(-2)}`,
                time: `${`0${rawTime.getHours()}`.slice(
                  -2
                )}:${`0${rawTime.getMinutes()}`.slice(-2)}`
              },
              lastEvent
            };
          });
        })
        .catch(error => {
          alert(error);
        });
      vm.fetchStats();
    },
    fetchNotes() {
      const vm = this;
      const notesQuery = new AV.Query("Note");
      const currentUser = AV.User.current();
      notesQuery
        .equalTo("owner", currentUser)
        .include("clients")
        .descending("createdAt")
        .limit(4)
        .find()
        .then(notes => {
          vm.recentNotes = notes;
        })
        .catch(error => {
          alert(error);
        });
    },
    async fetchStats() {
      const vm = this;
      try {
        vm.stats.eventsCompleted = await new AV.Query("Event")
          .equalTo("done", true)
          .count();
        vm.stats.eventsOpen = await new AV.Query("Event")
          .equalTo("done", false)
          .count();
        vm.stats.clients = await new AV.Query("Client")
          .equalTo("archived", false)
          .count();
        vm.stats.companies = await new AV.Query("Company").count();
        vm.stats.events = await new AV.Query("Event").count();
        vm.stats.notes = await new AV.Query("Note").count();
        vm.stats.newClients = await new AV.Query("Client")
          .descending("createdAt")
          .equalTo("archived", false)
          .limit(3)
          .find();
      } catch (error) {
        alert(error);
      }
    },
    async fetchData() {
      const vm = this;
      var pastMonth = new Date();
      const currentDate = new Date();
      pastMonth.setMonth(pastMonth.getMonth() - 1);
      await new AV.Query("Event")
        .equalTo("done", false)
        .include("client") //need this to include client child
        .find()
        .then(events => {
          events.forEach(function (event) { ///fails if event of deleted client
            try {
              if (event.get("time") >= pastMonth && event.get("time") < currentDate && event.get('client').get('archived') == false) //but less than current time?? 
              {
                if (event.get("client").get("fullName") in vm.doneEventDataMap)
                {
                  vm.doneEventDataMap[event.get("client").get("fullName")] += 1;              
                }
                else 
                {
                  vm.doneEventDataMap[event.get("client").get("fullName")] = 1;
                }
              }
            }
            catch (error) {
              // console.log("event with deleted client");
            }
          }); 
        });
      
    },
    async sortData() {
      const vm = this;
      await vm.fetchData();
      vm.items =  Object.keys(vm.doneEventDataMap).map(function(key) {
        return [key, vm.doneEventDataMap[key]];
      });
      vm.items.sort(function(first, second) {
        return second[1] - first[1];
      });
      var len = vm.items.length;
      if (len > 5) {
        vm.items = vm.items.slice(0,5);   //cap at 5 
        len = 5;
      }
      var i;
      for (i = 0; i <len; i++) {
        vm.series[0].data.push(vm.items[i][1]);
        vm.chartOptions.xaxis.categories.push(vm.items[i][0]);
      }
      if (len == 0){
        vm.noData = true;
      }
      vm.modified = true;
    },
    add(event) {
      const vm = this;
      event.event.set(
        "time",
        new Date(
          event.pendingChanges.date.slice(0, 4),
          event.pendingChanges.date.slice(5, 7) - 1,
          event.pendingChanges.date.slice(8, 10),
          event.pendingChanges.time.slice(0, 2),
          event.pendingChanges.time.slice(3, 5),
          0
        )
      ).set(
          "endTime",
          new Date(
            event.pendingChanges.date.slice(0, 4),
            event.pendingChanges.date.slice(5, 7) - 1,
            event.pendingChanges.date.slice(8, 10),
            event.pendingChanges.endTime.slice(0, 2),
            event.pendingChanges.endTime.slice(3, 5),
            0
          )
      );
      event.lastEvent.unset("recursIn");
      AV.Object.saveAll([event.event, event.lastEvent])
        .then(vm.fetchEvents)
        .catch(error => {
          alert(error);
        });
    },
    dismiss(event) {
      const vm = this;
      event.lastEvent
        .unset("recursIn")
        .save()
        .then(vm.fetchEvents)
        .catch(error => {
          alert(error);
        });
    }
  }
};
</script>

<style scoped>

#container {
  width: 100%;
  height: 100%;
  display: flex;
  -webkit-box-align: center;
  -ms-flex-align: center;
  align-items: center;
  border-collapse: separate;
  -webkit-appearance: none;
  -webkit-box-sizing: border-box;
  box-sizing: border-box;
  border-radius: 0;
}

#clientButton {
  overflow-x: auto;
  width: 100%;
  margin: 2px;
}

#client {
  width: auto;
  margin-left: 10px;
  -webkit-box-align: center;
}

#image {
  width: 40px; 
  height: 40px;
  border-radius: 64px;
  overflow: hidden;
  cursor: pointer;
}
#image > img {
  width: 100%;
  height: 100%;
  object-fit: cover;
}
#image > span {
  position: absolute;
  right: 0;
  bottom: 0;
  left: 0;
  height: 32px;
  background-color: #00000099;
  color: #fff;
  line-height: 28px;
  text-align: center;
}
#image:focus > span,
#image:hover > span {
  background-color: #000000cc;
}
#image + input[type="file"] {
  display: none;
}

.horizontal-items {
  display: flex;
  position: relative;
  left: -18px;
  width: calc(100% + 36px);
  margin-top: 0.3em;
  padding: 0 18px;
  overflow-x: auto;
}
.horizontal-item > .card {
  margin: 0 12px 0 0;
  width: 256px;
  padding: 12px;
  height: 100%;
}
.horizontal-item:last-of-type > .card {
  margin: 0 18px 0 0;
}
.item-text-success {
  color: #36d5d8;
}
.item-text-danger {
  color: #e52f2e;
}
@media (min-width: 544px) {
  .horizontal-items {
    left: -24px;
    width: calc(100% + 48px);
    padding: 0 24px;
  }
  .horizontal-item > .card {
    margin: 0 16px 0 0;
    padding: 16px;
  }
  .horizontal-item:last-of-type > .card {
    margin: 0 24px 0 0;
  }
}
</style>
