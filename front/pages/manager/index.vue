<template>
  <div v-if="!isLoading" style="min-height: 100vh">
    <Loader />
  </div>
  <div v-else class="wrapper-manager-coworking" style="min-height: 100vh">
    <button class="btn-edit" @click="navigateTo('/manager/edit')">
      <img src="~assets/icon_edit.png" alt="edit" />
    </button>
    <div class="basic-information">
      <h2 class="indent-mng-bnt">Інформація профілю</h2>

      <div class="info-wrapper">
        <div class="property">E-mail</div>
        <div class="value">
          <input
            class="basic-inp"
            type="text"
            v-model="authUser.email"
            readonly
          />
        </div>
      </div>
      <!-- <div class="info-wrapper">
        <div class="property">Пароль</div>
        <div class="value">
          <input
            class="basic-inp"
            type="password"
            v-model="manager.password"
            readonly
          />
        </div>
      </div> -->

      <div class="info-wrapper">
        <div class="property">Ім'я</div>
        <div class="value">
          <input
            class="basic-inp"
            type="text"
            readonly
            placeholder="Ваше ім'я"
            v-model="authUser.name"
          />
        </div>
      </div>
      <div class="info-wrapper">
        <div class="property">Прізвище</div>
        <div class="value">
          <input
            class="basic-inp"
            type="text"
            readonly
            placeholder="Ваше прізвище"
            v-model="authUser.surname"
          />
        </div>
      </div>
      <div class="info-wrapper">
        <div class="property">Контактний телефон</div>
        <div class="value">
          <input
            class="basic-inp"
            type="text"
            v-model="authUser.phone"
            placeholder="Ваш телефон"
            readonly
          />
        </div>
      </div>
    </div>
  </div>
</template>

<script>
definePageMeta({
  layout: "layout-auth-users",
});

export default {
  data() {
    return {};
  },

  mounted() {
    this.setManagerData();
    this.getUserData();
  },
  computed: {
    authUser() {
      return this.$store.state.authUser;
    },
    isLoading() {
      return this.$store.state.isLoading;
    },
  },
  methods: {
    setManagerData() {
      if (localStorage.getItem("managerData")) {
        this.$store.commit(
          "setManagerData",
          JSON.parse(localStorage.getItem("managerData")),
        );
      }
    },
    getUserData() {
      try {
        const { $api } = useNuxtApp();
        $api
          .get(`/users?id=${this.$store.state.authUser.id}`)
          .then((response) => {
            if (response.data) {
              this.$store.commit("getUserData", response.data);
            }
          });
      } catch (error) {
        console.log(error);
      } finally {
        this.$store.state.isLoading = true;
        this.$store.state.activeTabAuthUserMenu = "profileActive";
      }
    },
  },
};
</script>

<style>
.indent-mng-bnt {
  text-align: left;
}

.btn-edit {
  position: absolute;
  background-color: #09273b;
  top: 16px;
  right: 0px;
  width: 46px;
  height: 46px;
  border-radius: 6px;
}

.wrapper-manager-coworking {
  display: flex;
  flex-direction: column;
  font-family: Inter;
  font-size: 20px;
  font-style: normal;
  font-weight: 400;
  line-height: normal;
  position: relative;
  padding-bottom: 140px;
  color: var(--black-color);
}

.wrapper-manager-coworking h2 {
  margin: 24px;
  padding: 0;
  font-size: 20px;
  font-weight: 900;
}

.basic-information {
  padding-bottom: 32px;
  border-bottom: 2px solid var(--text-color);
}

.basic-information .info-wrapper {
  display: flex;
  flex-direction: column;
  justify-content: flex-start;
  margin-bottom: 24px;
}

.basic-information .info-wrapper .property {
  width: 100%;
  margin-right: 10px;
  margin-bottom: 12px;
}

.basic-information .basic-inp {
  width: 95%;
}
@media (min-width: 375px) {
  .indent-mng-bnt {
    text-align: center;
  }
  .basic-information .basic-inp {
    width: 343px;
  }
}

@media (min-width: 768px) {
  .btn-edit {
    top: 24px;
    right: 0px;
  }

  .wrapper-manager-coworking {
    padding-bottom: 110px;
  }

  .wrapper-manager-coworking h2 {
    margin: 32px;
    font-size: 24px;
  }

  .basic-information {
    padding-bottom: 42px;
  }

  .basic-information .info-wrapper {
    flex-direction: row;
    justify-content: flex-start;
  }

  .basic-information .info-wrapper .property {
    width: 35%;
    margin-bottom: 0px;
  }
  .basic-information .basic-inp {
    width: 300px;
  }
}

@media (min-width: 900px) {
  .basic-information .basic-inp {
    width: 400px;
  }
}
</style>
