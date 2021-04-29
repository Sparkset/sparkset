<template>
  <form @submit.prevent="createClientNote">
    <h1>Create New Client Note</h1>
    <div class="field field--half">
      <label>
        <span class="required-field">Title</span>
        <input type="text" v-model="newClientNote.title" required />
      </label>
    </div>
    <div class="field field--half">
      <label>
        <span class="required-field">Content</span>
        <input type="text" v-model="newClientNote.content"/>
      </label>
    </div>
    <div class="field">
      <button type="submit" class="primary">
        Save
      </button>
    </div>
    <div class="field">
      <button type="button" @click="cancel">Cancel</button>
    </div>
  </form>
</template>

<script>
export default {
  name: "AddClientNote",
  data() {
    return {
      newClientNote: {
        title: "",
        content: "",
      }
    };
  },
  methods: {
    createClientNote() {
      const vm = this;
      vm.$emit("create-clientNote", vm.newClientNote);
    },
    cancel() {
      const vm = this;
      vm.$emit("cancel-clientNote");
    }
  }
};
</script>

<style scoped>
  .required-field::after{
    content:" *";
    color:red;
  }
</style>
