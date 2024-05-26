<template>
  <div @click.self="closeModal" class="modal-wrapper">
    <div class="first-modal">
      <button @click="closeModal"></button>
      <span class="sp">{{ title }}</span>
      <p>{{ description }}</p>
    </div>
  </div>
</template>

<script>
export default {
  props: {
    title: "",
    description: "",
  },
  components: {},
  data() {
    return {};
  },
  methods: {
    closeModal() {
      this.$emit("close");
    },
  },
};
</script>
<style scoped>
p {
  margin: 24px 0 0 0;
}

.modal-wrapper {
  position: absolute;
  z-index: 1000;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  width: 100%;
  height: 100%;
  background-color: rgba(3, 36, 57, 0.8);
}

.first-modal {
  display: flex;
  flex-direction: column;
  width: 279px;
  height: 164px;
  padding: 32px;
  background-color: #fff;
  position: absolute;
  left: 50%;
  top: 50%;
  transform: translate(-50%, -50%);
  border-radius: 10px;
  text-align: center;
  color: #031c2c;
  font-family: Verdana;
  font-size: 20px;
  font-style: normal;
  font-weight: 400;
  line-height: normal;
}

.modal-wrapper .first-modal button {
  width: 23px;
  height: 23px;
  position: absolute;
  top: 10px;
  right: 16px;
  cursor: pointer;
  background-image: url("~/assets/icon_close_modal.png");
  background-color: transparent;
  border: none;
}

@media (min-width: 768px) {
  .first-modal {
    width: 544px;
    height: 160px;
  }
}
</style>
