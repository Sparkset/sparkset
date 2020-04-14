<template>
  <div>
      <span>{{att.key}}</span>
      <input v-model="att.value" type="text" :disable="!editing" required/>
  </div>
</template>

<script>
export default {
  name: "UniqueAttributeForm",
  props: {
      att: Object
  },

};
</script>

<style scoped></style>
