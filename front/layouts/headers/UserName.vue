<template>
  <div class="container-user-auth-name">
    <div class="item main-user-auth-name">
      <!-- <img src="~/assets/profile.svg" alt="Profile Icon" /> -->
      <span> {{ userName }}</span> &nbsp;<span>{{ userSurname }}</span>
    </div>
    <div class="item cabinet" :class="{ active: isInCabinet }">
      <a :href="setRout()">
        <span @click="menuOpen = false"
          ><v-icon class="icon">mdi-account</v-icon>Кабінет</span
        >
      </a>
    </div>
    <div class="item exit">
      <nuxt-link href="/">
        <span @click="goOut"
          ><v-icon class="icon">mdi-logout</v-icon>Вихід</span
        >
      </nuxt-link>
    </div>
  </div>
</template>

<script>
export default {
  components: {},
  data() {
    return {
      menuOpen: false,
    };
  },
  computed: {
    userRole() {
      return this.$store.state.userRole;
    },
    userName() {
      if (this.$store.state.authUser.name) {
        return this.$store.state.authUser.name;
      } else {
        return "";
      }
    },
    userSurname() {
      if (this.$store.state.authUser.surname) {
        return this.$store.state.authUser.surname;
      } else {
        return "";
      }
    },
    isInCabinet() {
      const currentPath = this.$route.path;
      return (
        currentPath.startsWith("/manager") ||
        currentPath.startsWith("/user") ||
        currentPath.startsWith("/admin")
      );
    },
  },
  methods: {
    toggleMenu() {
      this.menuOpen = !this.menuOpen;
    },
    setRout() {
      if (this.userRole == "manager") {
        return "/manager/coworking";
      } else if (this.userRole == "user") {
        return "/user";
      } else if (this.userRole == "admin") {
        return "/admin";
      }
    },
    goOut() {
      this.menuOpen = false;
      this.$store.commit("logOut");
    },
  },
  mounted() {},
};
</script>

<style scoped>
.container-user-auth-name {
  display: flex;
  align-items: flex-start;
  flex-direction: column;
  gap: 20px;
}

.main-user-auth-name {
  display: flex;
  align-items: center;
  margin-right: 10px;
}

.icon {
  margin-right: 5px;
}

img {
  margin-right: 5px;
}

.cabinet:hover,
.exit:hover {
  transform: scale(1.1);
}

.item.active {
  display: none;
}

@media (min-width: 768px) {
  .container-user-auth-name {
    flex-direction: row;
    align-items: center;
  }
}
</style>
