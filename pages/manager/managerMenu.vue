<template>
  <div class="menu">
    <button
      class="btn"
      @click="navigateTo('/manager')"
      :class="{ active: coworkingActive }"
    >
      Коворкінг
    </button>
    <button
      class="btn"
      @click="navigateTo('/manager/books')"
      :class="{ active: booksActive }"
    >
      Бронювання
    </button>
    <button
      class="btn"
      :class="{ active: reviewsActive }"
      @click="navigateTo('/manager/reviews')"
    >
      Відгуки
    </button>
  </div>
</template>

<script>
export default {
  props: {
    coworkingActive: {
      default: false,
      type: Boolean,
    },
    booksActive: {
      default: false,
      type: Boolean,
    },
    reviewsActive: {
      default: false,
      type: Boolean,
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
  border-radius: 6px 0 0 6px;
  margin-bottom: 32px;
}

.active {
  background-color: var(--text-color);
  color: var(--white-color);
}

@media (min-width: 900px) {
  .menu .btn {
    width: 260px;
  }
}
</style>