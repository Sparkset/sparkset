<template>
  <div>
    <div class="column">
      <div class="card">
        <EventForm :client="client" is-new :callback="callback" />
      </div>
    </div>
  </div>
</template>

<script>
import EventForm from "@/components/EventForm.vue";
// import AV from "leancloud-storage";
export default {
  name: "EventsAddPage",
  components: {
    EventForm
  },
//   data() {
//     return {
//       client: new AV.Object("Client").set("company", new AV.Object("Company"))
//     };
//   },
    methods: {
    callback() {
    const vm = this;
    vm.$router.push(`/client/${vm.client.id}`);
    }
    }
};
</script>

<style scoped></style>
