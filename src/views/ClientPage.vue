<template>
  <div>
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
        <section>
          <ul class="tags">
            <li>
              <router-link :to="`/client/${$route.params.id}`">
                <span>Profile</span>
              </router-link>
            </li>
            <li>
              <router-link :to="`/client/${$route.params.id}/events`">
                <span>Events</span>
              </router-link>
            </li>
            <li>
              <router-link :to="`/client/${$route.params.id}/files`">
                <span>Files</span>
              </router-link>
            </li>
          </ul>
        </section>
        <router-view :key="$route.path"></router-view>
      </div>
    </div>
  </div>
</template>

<script>
import AV from "leancloud-storage";
export default {
  name: "ClientPage",
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
.tags {
  margin: 0 18px;
  padding: 0;
  list-style: none;
}
.tags > li {
  display: inline-block;
  margin: 0 24px 0 0;
}
.tags > li > a > span {
  display: inline-block;
  padding: 12px 0;
  border-bottom: 2px solid transparent;
}
.tags > li > a:focus > span,
.tags > li > a:hover > span {
  color: #36d5d8;
}
.tags > li > a.router-link-exact-active > span {
  border-bottom: 2px solid #36d5d8;
  color: #36d5d8;
}
@media (min-width: 544px) {
  .tags {
    margin: 0 24px;
  }
  .tags > li {
    margin: 0 32px 0 0;
  }
}
</style>
