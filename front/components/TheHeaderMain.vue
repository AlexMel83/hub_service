<template>
  <div :class="{ 'header-main': true, 'home-page': isHomePage }">
    <div class="header-wrapper">
      <div class="logo-container">
        <div @click="hideMenu" class="logo">
          <NuxtLink to="/">
            <img src="~/assets/logo.png" alt="logo" />
          </NuxtLink>
        </div>
        <div class="header-buttons">
          <span class="lang-active">Ua &nbsp; </span><span> | En</span>
          <v-btn icon @click="toggleMenu" class="burger">
            <img
              v-if="!menuOpen"
              src="~/assets/menu.svg"
              alt="Profile Icon"
              style="width: 30px"
            />
            <img
              v-else
              src="~/assets/menu.svg"
              alt="Profile Icon"
              style="width: 30px"
            />
          </v-btn>
          <template v-if="!isAuthed">
            <v-btn class="header-btn" @click="openRegistration">
              Зареєструватися
            </v-btn>
            <v-btn class="header-btn" @click="openLogin"> Увійти</v-btn>
          </template>
        </div>
      </div>
      <div class="menu" v-if="menuOpen">
        <Login
          v-if="menuLogin"
          @openRegComponent="changeCompenent"
          :initialEmail="email"
        />
        <Registration v-else @openLoginComponent="changeCompenent" />
      </div>
      <p class="header-text">
        <span class="bold">HUB</span> - обирай коворкінг для ефективного
        навчання та роботи.
      </p>
    </div>
    <ModalComponents @closeModal="closeModal" :initialEmail="email" />
  </div>
</template>

<script>
import ModalComponents from "~/components/modal/ModalComponents.vue";
import Login from "~/components/modal/Login.vue";
import Registration from "~/components/modal/Registration.vue";
import { useStore } from "vuex";

export default {
  name: "Header",
  components: {
    ModalComponents,
    Login,
    Registration,
  },
  data() {
    return {
      menuOpen: false,
      menuLogin: true,
      isModalOpen: false,
      email: "",
    };
  },
  computed: {
    isAuthed() {
      return this.$store.state.isAuthed;
    },
    isHomePage() {
      return this.$route.path === "/";
    },
    isMenuOpen() {
      return this.$store.state.isMenuOpen;
    },
  },
  methods: {
    hideMenu() {
      this.menuOpen = false;
    },
    toggleMenu() {
      this.menuOpen = !this.menuOpen;
      this.$store.commit("toggleMenu");
    },
    closeModal() {
      this.isModalOpen = false;
      document.body.style.overflow = "";
      document.documentElement.style.overflow = "";
    },
    openRegistration() {
      document.body.style.overflow = "hidden";
      document.documentElement.style.overflow = "hidden";
      this.$bus.$emit("Modal", {
        showRegistration: true,
        openModal: true,
      });
    },
    openLogin() {
      if (window.innerWidth > 768) {
        document.body.style.overflow = "hidden";
        document.documentElement.style.overflow = "hidden";
        this.$bus.$emit("Modal", {
          showLogin: true,
          openModal: true,
        });
      }
    },
    changeCompenent() {
      this.menuLogin = !this.menuLogin;
    },
  },
  mounted() {
    const emailRegex = /([\w.%+-]+@[A-Za-z0-9.-]+\.[A-Za-z]{2,})/;
    if (this.$route.query.email) {
      this.email = this.$route.query.email;
      const match = this.email.match(emailRegex);
      if (match) {
        this.email = match[0];
        this.openLogin();
      } else this.email = "";
    }
  },
};
</script>

<style scoped>
.header-main {
  display: flex;
  flex-direction: column;
  justify-content: flex-start;
  background-color: var(--header-bg);
  color: var(--white-color);
  position: relative;
}

.logo img {
  width: 50px;
  height: 30px;
}

.logo-container {
  display: flex;
  justify-content: space-between;
  align-items: center;
  max-width: 1440px;
  margin: 0 auto;
  padding: 16px;
}

.header-btn {
  margin-left: 24px;
  height: 30px;
  display: none;
  text-transform: capitalize;
}

.burger {
  margin-left: 15px;
  color: white;
  background-color: transparent;
  box-shadow: none;
}

.menu {
  position: relative;
  top: 100%;
  left: 0;
  width: 100%;
  background-color: var(--header-bg);
  z-index: 2;
  display: flex;
  flex-direction: column;
  align-items: center;
  padding: 3px 0 0 0;
}

.header-menu-btn {
  width: 100%;
  max-width: 343px;
  height: 46px;
  text-transform: capitalize;
}

.header-menu-btn:hover {
  color: var(--btn-border);
}
.header-menu-btn:active {
  border-radius: 4px;
  border: 1px solid var(--btn-border);
  background: var(--white-color);
}

.header-menu-btn:not(:last-child) {
  margin-bottom: 24px;
}

.header-buttons {
  height: 30px;
  display: flex;
  align-items: center;
}

.header-text {
  display: none;
}

.lang-active {
  font-weight: 700;
}

.bold {
  font-size: 2.25rem;
  font-weight: 900;
}
.is-user {
  margin-right: 20px;
  font-size: 16px;
}
.is-user span {
  margin-right: 5px;
}

@media (min-width: 768px) {
  .header-main.home-page {
    background-image: url("~/assets/header_bg.png");
    background-size: cover;
  }
  .header-main.home-page .header-text {
    display: block;
    text-align: center;
    font-size: 1.5rem;
    max-width: 1092px;
    margin: 10px auto;
  }

  .header-text {
    display: none;
  }

  .logo img {
    width: 84px;
    height: 50px;
  }

  .burger {
    display: none;
  }

  .header-btn {
    display: block;
    letter-spacing: normal;
    font-size: 16px;
    padding: 0 12px;
  }

  .header-btn:hover {
    background-color: var(--white-color);
    color: var(--btn-border) !important;
  }

  .header-buttons {
    display: flex;
    align-items: center;
  }
  .menu {
    display: none;
  }

  @media (min-width: 1024px) {
    .logo-container {
      padding: 32px 64px;
    }
  }
}
</style>
