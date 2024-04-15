<template>
  <div v-if="modal" @click.self="closeModal" class="modal-registration-wrapper">
    <div class="registration">
      <button class="close" @click="closeModal">
        <img src="~/assets/icon_close_modal.png" alt="close" />
      </button>
      <Registration v-if="openRegistration" />
      <Login v-if="openLogin" :emailprops="emailProps" />
      <BookForm v-if="openBook" />
      <p>{{ textModalMessage }}</p>
    </div>
  </div>
</template>

<script setup>
import Registration from "~/components/modal/Registration.vue";
import Login from "~/components/modal/Login.vue";
import BookForm from "~/components/modal/BookForm.vue";

import { ref } from "vue";
var modal = ref(false);
var openRegistration = ref(false);
var openLogin = ref(false);
var openBook = ref(false);
let textModalMessage = ref("");
let emailProps = ref("");
const bus = useNuxtApp().$bus;
bus.$on("Modal", (data) => {
  modal.value = data.openModal;
  openRegistration.value = data.showRegistration;
  openLogin.value = data.showLogin;
  openBook.value = data.showBook;
  textModalMessage.value = data.textModalMessage;
  emailProps.value = data.emailProps;
});
</script>
<script>
export default {
  components: { Registration, Login, BookForm },
  methods: {
    closeModal() {
      this.$emit("closeModal");
      document.body.style.position = "";
      this.$bus.$emit("Modal", {
        openModal: false,
      });
    },
  },
};
</script>
<style scoped>
.modal-registration-wrapper {
  display: block;
  position: fixed;
  z-index: 3;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  width: 100%;
  height: 100%;
  background-color: var(--background-modal);
}

.registration {
  position: absolute;
  left: 50%;
  top: 50%;
  transform: translate(-50%, -50%);
  display: flex;
  flex-direction: column;
  align-items: center;
  margin: 0 auto;
  background-color: #fff;
  border-radius: 10px;
  padding: 40px 0px 32px 0px;
}

.registration .close {
  position: absolute;
  background-color: transparent;
  top: 25px;
  right: 25px;
  width: 23px;
}
.registration .close:focus {
  border: none;
}

.modal-registration-wrapper .registration p {
  margin: 20px;
  text-align: center;
}
</style>
