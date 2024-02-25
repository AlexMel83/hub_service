<template>
  <div class="header">
    <div class="logo"></div>
  </div>
</template>

<script>
export default {
  name: "Header",
  components: {},
  data() {
    return {};
  },
  methods: {},
};
</script>
<style scoped>
.header {
  padding: 24px;
  display: flex;
  flex-direction: row;
  justify-content: flex-start;
}
.logo {
  width: 84px;
  height: 51px;
  background-image: url("~/assets/logo.png");
  background-color: transparent;
}
.header-link {
  color: white;
  text-decoration: none;
  margin-top: 15px;
}
</style>
