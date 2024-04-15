<template>
  <div :class="{ 'header-main': true, 'home-page': isHomePage }">
    <div class="header-wrapper">
      <div class="logo-container">
        <div class="logo">
          <NuxtLink to="/">
            <img src="~/assets/logo.png" alt="logo" />
          </NuxtLink>
        </div>
        <div class="header-buttons">
          <span class="lang-active">Ua &nbsp; </span><span> | En</span>
          <v-btn class="header-btn" @click="exitLogin"> Вихід</v-btn>
        </div>
      </div>
      <p class="header-text">
        <span class="bold">EduHUB</span> - обирай коворкінг для ефективного
        навчання та роботи.
      </p>
    </div>
  </div>
</template>

<script scoped>
export default {
  name: "Header",
  methods: {
    exitLogin() {
      this.$router.push("/");
    },
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
  display: flex;
  text-transform: capitalize;
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

  .header-btn {
    display: block;
    letter-spacing: normal;
    font-size: 16px;
    padding: 0 12px;
  }

  .header-btn:hover {
    background-color: var(--white-color);
    color: var(--btn-border);
  }

  .header-buttons {
    display: flex;
    align-items: center;
  }

  @media (min-width: 1024px) {
    .logo-container {
      padding: 32px 64px;
    }
  }
}
</style>
