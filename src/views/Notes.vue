<template>
  <div>
    <div class="columns">
      <div class="column">
        <div class="col">
          <div>
            <h1>{{ title }} ({{ notes.length }})</h1>
            <div class="form">
              <div class="form-group">
                <label>Title</label>
                <input class="form-control" type="text" v-model="note.title" />
              </div>
              <div class="form-group">
                <label>Text</label>
                <textarea
                  rows="5"
                  class="form-control"
                  v-model="note.text"
                ></textarea>
              </div>
              <button class="btn btn-primary" @click="addNote">
                Save Note
              </button>
              <div
                class="alert alert-danger text-center"
                role="alert"
                v-bind:class="{ active: isActive }"
              >
                Both fields are required
              </div>
            </div>
            <div class="row">
              <div
                class="col-note"
                v-for="(note, index) in notes"
                :key="note.id"
              >
                <div class="card">
                  <button class="close" @click="removeNote(index)">
                    &times;
                  </button>
                  <div class="card-block">
                    <h3 class="card-title">{{ note.title }}</h3>
                    <h4 class="card-date">{{ note.date }}</h4>
                    <p class="card-text">{{ note.text }}</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: "OverviewPage",
  data() {
    return {
      isActive: false,
      title: "Notepad",
      note: {
        title: "",
        text: ""
      },
      notes: []
    };
  },
  methods: {
    addNote() {
      let { text, title } = this.note;
      if (this.note.text.length >= 1 && this.note.title.length >= 1) {
        this.notes.push({
          text,
          title,
          date: new Date(Date.now()).toLocaleString()
        });
        this.isActive = false;
        this.note.text = "";
        this.note.title = "";
      } else {
        this.isActive = true;
      }
    },
    removeNote(index) {
      this.notes.splice(index, 1);
    }
  }
};
</script>

<style scoped>
button.btn {
  display: block;
  padding: 15px 20px;
  margin: 20px 0px 10px 0px;
  width: 100%;
  box-shadow: 0px 1px 3px rgb(217, 217, 217);
  border: none;
  border-radius: 100px;
}
h1 {
  text-align: center;
}
.alert {
  display: none;
}
.active {
  display: block;
}
.card {
  border-radius: 30px;
  margin: 20px 0px 1px 0px;
  padding: 25px;
}
.col > div {
  max-width: 700px;
  margin: 0px auto;
}
.form-group {
  margin: 0px 0px 20px 0px;
}
</style>
