<template>
  <div>
    <div class="columns">
      <div class="column">
        <div class="card">
          <section class="fields">
            <h1>Clients</h1>
            <div class="field">
              <p>This can be the page for showing all clients.</p>
            </div>
          </section>
        </div>

        <button id="modalbutton" @click="modalAction()"> Add Client </button>

        <!-- <div id="app">
          <button id="modalbutton" @click="modalAction()"> Add Client </button>
          <div v-if="modal" class="justify-center">
            <div class="bg-black p-4 rounded">
              <h2>Hello</h2>
              <p>I hope this modal works</p>
              <button @click="modalAction()"> Close </button>
            </div>
          </div>
        </div> -->

      </div>
    </div>
  </div>
</template>

<script src="https://cdn.jsdelivr.net/npm/vue/dist/vue.js"></script>
<script src="https://cdnjs.cloudflare.com/ajax/libs/vue/1.0.18/vue.min.js"></script>

<script>
export default {
  name: "ClientsPage"
};
</script>

// <script>
//  Vue.component("modal", {
//     template: "#modal-template"
// });

// var app= new Vue({
//   el: '#app',
//   data: {
//     modal: false
//   },
//   methods: {
//     modalAction() {
//       if(this.modal == false) {
//         this.modal= true
//       } else {
//         this.modal= false
//       }
      
//     }
//   }
// })
// </script>

<style scoped></style>

