<template>
  <div class="menu" v-if="manager">
    <button
      class="btn"
      @click="navigateTo('/manager')"
      :class="{ active: activeTab === 'profileActive' }"
    >
      Профіль
    </button>
    <button
      class="btn"
      @click="navigateTo('/manager/coworking')"
      :class="{ active: activeTab === 'coworkingActive' }"
    >
      Коворкінг
    </button>
    <button
      class="btn"
      @click="navigateTo('/manager/books')"
      :class="{ active: activeTab === 'booksActive' }"
    >
      Бронювання
    </button>
    <button
      class="btn"
      :class="{ active: activeTab === 'reviewsActive' }"
      @click="navigateTo('/manager/reviews')"
    >
      Відгуки
    </button>
  </div>
</template>

<script>
export default {
  computed: {
    manager() {
      return this.$store.state.manager;
    },
    activeTab() {
      return this.$store.state.activeTabAuthUserMenu;
    },
  },
};
</script>

<style scoped>
.menu {
  display: flex;
  flex-direction: column;
  font-family: Inter;
  font-size: 20px;
  font-style: normal;
  font-weight: 400;
  line-height: normal;
}
.menu .btn {
  width: 200px;
  height: 48px;
  border: 1px solid var(--text-color);
  border-radius: 6px;
  margin-bottom: 32px;
}

.menu .btn:hover,
.menu .btn:active {
  color: var(--white-color);
}

.active {
  background-color: var(--text-color);
  color: var(--white-color);
}

@media (min-width: 768px) {
  .menu .btn {
    border-radius: 6px 0 0 6px;
  }
}

@media (min-width: 900px) {
  .menu .btn {
    width: 260px;
  }
}
</style>
