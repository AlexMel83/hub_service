<template>
  <TheHeaderMain />
  <NuxtLayout name="404">
      <div>
        <button class="button" @click="goBack" >Повернутися на головну</button>
      </div>
  </NuxtLayout>
  <TheFooterMain />
</template>

<script>
export default {
  methods: {
    goBack() {
      this.$router.push('/')
    }
  }
}
</script>

<style scoped>
.button {
  width: 306px;
  padding: 12px 24px;
  background: var(--1, #09273B);
  color: white;
  border-radius: 6px;
}
</style>
