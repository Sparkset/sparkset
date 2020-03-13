<template>
  <div>
    <div class="columns">
      <div class="column column--right">
        <div class="card card--center">
          <section class="fields">
            <div class="field">
              <div
                id="image"
                tabindex="0"
                @click="pickPicture"
                @keypress.enter="pickPicture"
              >
                <img
                  :src="
                    client.get('picture')
                      ? client.get('picture').url()
                      : 'https://www.gravatar.com/avatar/00000000000000000000000000000000?d=mp&f=y'
                  "
                  alt="The picture of the client."
                />
                <span>Edit</span>
              </div>
              <input id="avatar-upload" type="file" @change="uploadPicture" />
            </div>
            <div class="field">
              <p>
                Since
                {{
                  client.createdAt
                    ? client.createdAt.toLocaleDateString("en-US", {
                        year: "numeric",
                        month: "long",
                        day: "numeric"
                      })
                    : undefined
                }}
              </p>
            </div>
          </section>
        </div>
      </div>
      <div class="column column--left">
        <div class="card">
          <ClientForm :client="client" :key="client.id" :callback="callback" />
        </div>
        <div class="card">
          <section class="fields">
            <h1>Events</h1>
          </section>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import ClientForm from "@/components/ClientForm.vue";
import AV from "leancloud-storage";
export default {
  name: "ClientPage",
  components: {
    ClientForm
  },
  data() {
    return {
      client: new AV.Object("Client").set("company", new AV.Object("Company"))
    };
  },
  created() {
    const vm = this;
    const clientQuery = new AV.Query("Client");
    clientQuery
      .include("company")
      .get(vm.$route.params.id)
      .then(client => {
        vm.client = client;
      })
      .catch(error => {
        alert(error);
      });
  },
  methods: {
    pickPicture() {
      document.getElementById("avatar-upload").click();
    },
    uploadPicture() {
      const vm = this;
      const avatarUpload = document.getElementById("avatar-upload");
      let file = null;
      if (avatarUpload.files.length) {
        const localFile = avatarUpload.files[0];
        file = new AV.File(localFile.name, localFile);
      }
      vm.client
        .set("picture", file)
        .save()
        .then(client => {
          vm.client = client;
          alert("Profile picture uploaded.");
        })
        .catch(error => {
          alert(error);
        });
    },
    callback() {
      alert("Profile updated.");
    }
  }
};
</script>

<style scoped>
#image {
  position: relative;
  display: inline-block;
  margin: 16px auto 0 auto;
  width: 128px;
  height: 128px;
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
#avatar-upload {
  display: none;
}
</style>
