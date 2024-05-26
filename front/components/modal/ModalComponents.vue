<template>
  <div v-if="modal" @click.self="closeModal" class="modal-registration-wrapper">
    <div class="registration">
      <button class="close" @click="closeModal">
        <img src="~/assets/icon_close_modal.png" alt="close" />
      </button>
      <Registration v-if="openRegistration" />
      <Login v-if="openLogin" :initialEmail="initialEmail" />
      <BookForm v-if="openBook" />
      <BookSpace v-if="openBookSpace" />
      <p>{{ textModalMessage }}</p>
    </div>
  </div>
</template>

<script setup>
import Registration from "~/components/modal/Registration.vue";
import Login from "~/components/modal/Login.vue";
import BookForm from "~/components/modal/BookForm.vue";
import BookSpace from "~/components/modal/BookSpace.vue";

import { ref } from "vue";
var modal = ref(false);
var openRegistration = ref(false);
var openLogin = ref(false);
var openBook = ref(false);
var openBookSpace = ref(false);
let textModalMessage = ref("");
const bus = useNuxtApp().$bus;
bus.$on("Modal", (data) => {
  modal.value = data.openModal;
  openRegistration.value = data.showRegistration;
  openLogin.value = data.showLogin;
  openBook.value = data.showBook;
  openBookSpace.value = data.showBookSpace;
  textModalMessage.value = data.textModalMessage;
});
</script>
<script>
export default {
  components: { Registration, Login, BookForm },
  props: {
    initialEmail: {
      type: String,
      required: false,
      default: "",
    },
  },
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
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background: rgba(0, 0, 0, 0.5);
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 10000;
  background-color: var(--background-modal);
}

.registration {
  min-width: 300px;
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
