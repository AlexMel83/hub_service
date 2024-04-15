<template>
  <div class="wrapper-page">
    <div class="wrapper-form">
      <div class="name-form">
        <p>Забронювати коворкінг</p>
      </div>
      <div class="form">
        <TopForm />
        <NameInput
          @giveName="isName"
          :isError="isNameError"
          :textNameError="isTextNameError"
          :clearForm="clearForm"
        />
        <EmailInput
          @giveEmail="isEmail"
          :isError="isEmailError"
          :textEmailError="isTextEmailError"
          :clearForm="clearForm"
        />
        <PhoneInput
          @givePhone="isPhone"
          :isError="isPhoneError"
          :textPhoneError="isTextPhoneError"
          :clearForm="clearForm"
        />
        <DateInput @getDate="isDate" />
        <TimeInput @getTime="isTime" />
        <PersonInput @givePerson="isPerson" :isError="isPersonError" />
        <RegButton @click="registrate" />
        <TheModal
          @close="closeModal"
          v-if="isShownModal"
          :title="modalTitle"
          :description="modalDescription"
        />
      </div>
    </div>
  </div>
</template>

<script>
import TopForm from "../components/formComponents/TopForm.vue";
import NameInput from "../components/formComponents/NameInput.vue";
import EmailInput from "../components/formComponents/EmailInput.vue";
import PhoneInput from "../components/formComponents/PhoneInput.vue";
import DateInput from "../components/formComponents/DateInput.vue";
import TimeInput from "../components/formComponents/TimeInput.vue";
import PersonInput from "../components/formComponents/PersonInput.vue";
import RegButton from "../components/formComponents/RegButton.vue";
import TheModal from "../components/TheModal.vue";
import axios from "axios";
import { useReCaptcha } from "vue-recaptcha-v3";

definePageMeta({
  layout: "custom",
});

export default {
  name: "IndexPage",
  components: {
    TopForm,
    NameInput,
    EmailInput,
    PhoneInput,
    DateInput,
    TimeInput,
    PersonInput,
    RegButton,
    TheModal,
  },
  data() {
    return {
      name: "",
      email: "",
      phone: "",
      firstDate: "",
      secondDate: "",
      firstTime: "",
      secondTime: "",
      person: 1,
      isNameError: false,
      isTextNameError: "",
      isTextEmailError: "",
      isTextPhoneError: "",
      isEmailError: false,
      isPhoneError: false,
      isPersonError: false,
      isShownModal: false,
      modalTitle: "",
      modalDescription: "",
      emailRegex: /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/,
      phoneRegex: /^\+38 \(0[1-9]\d{1}\) \d{3} \d{2} \d{2}$/,
      clearForm: false,
    };
  },
  setup() {
    const recaptchaInstance = useReCaptcha();
    const recaptcha = async () => {
      await recaptchaInstance?.recaptchaLoaded();
      const token = await recaptchaInstance?.executeRecaptcha("yourActionHere");
      return token;
    };
    return {
      recaptcha,
    };
  },
  methods: {
    isName(data) {
      this.name = data;
    },
    isEmail(data) {
      this.email = data;
    },
    isPhone(data) {
      this.phone = data;
    },
    isDate(data) {
      this.firstDate = data.firstDate;
      this.secondDate = data.secondDate;
    },
    isTime(data) {
      this.firstTime = data.firstTime;
      this.secondTime = data.secondTime;
    },
    isPerson(data) {
      this.person = data;
    },
    registrate() {
      if (this.name.trim() == "") {
        this.isTextNameError = "Це поле є обов’язковим для заповнення";
        this.isNameError = true;
      } else if (this.name.length < 2) {
        this.isTextNameError = "Поле заповненно невірно";
        this.isNameError = true;
      } else {
        this.isTextNameError = "";
        this.isNameError = false;
      }

      if (this.email.trim() == "") {
        this.isTextEmailError = "Це поле є обов’язковим для заповнення";
        this.isEmailError = true;
      } else if (!this.emailRegex.test(this.email)) {
        this.isTextEmailError = "Поле заповненно невірно";
        this.isEmailError = true;
      } else {
        this.isTextEmailError = "";
        this.isEmailError = false;
      }

      this.isPhoneError = this.phone.trim() == "";
      if (this.phone.trim() == "") {
        this.isTextPhoneError = "Це поле є обов’язковим для заповнення";
        this.isPhoneError = true;
      } else if (!this.phoneRegex.test(this.phone)) {
        this.isTextPhoneError = "Поле заповненно невірно";
        this.isPhoneError = true;
      } else {
        this.isTextPhoneError = "";
        this.isPhoneError = false;
      }

      this.isPersonError = this.person == 0;
      if (!this.isEmailError && !this.isNameError && !this.isPhoneError) {
        this.sendData();
      }
    },
    closeModal() {
      this.isShownModal = false;
      this.clearForm = !this.clearForm;
      this.name = "";
      this.email = "";
      this.phone = "";
    },
    async sendData() {
      try {
        const token = await this.recaptcha();
        let formData = new FormData();
        formData.append("first_name", this.name);
        formData.append("email", this.email);
        formData.append("phone", this.phone);
        formData.append("g-recaptcha-response", token);
        formData.append("organization_id", "1");
        await axios.post("https://intita.com/api/v1/entrant", formData);
        this.modalTitle = "Дякуємо!";
        this.modalDescription =
          "Менеджер зв’яжеться з Вами найближчим часом для підтвердження бронювання.";
      } catch (error) {
        this.modalTitle = "";
        this.modalDescription =
          "Сервер тимчасово перевантажений. Будь ласка, cпробуйте пізніше";
      } finally {
        this.isShownModal = true;
      }
    },
  },
};
</script>
<style>
*,
::before,
::after {
  background-repeat: repeat;
  box-sizing: initial;
}
.wrapper-page {
  width: 100%;
  display: flex;
  justify-content: center;
  align-items: center;
  position: relative;
  padding-bottom: 10px;
}

.wrapper-form {
  width: 300px;
  z-index: 1;
}

.name-form {
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  width: 276px;
  height: 35px;
  margin: 0 auto;
  background-color: #f95c65;
  border-radius: 20px 20px 0 0;
}

.name-form p {
  color: #fff;
  font-family: Verdana;
  font-size: 16px;
  font-style: normal;
  font-weight: 400;
  line-height: normal;
  padding: 0;
}
.form {
  display: flex;
  flex-direction: column;
  align-items: center;
  background-color: #f5f5f5;
  padding: 16px 8px;
  border-radius: 20px;
}

.form .input-wrapper {
  display: flex;
  flex-direction: row;
  justify-content: space-between;
  width: 284px;
  height: 29px;
  margin: 0 auto 16px auto;
  color: #062539;
  font-family: Verdana;
  font-size: 16px;
  font-style: normal;
  font-weight: 400;
  line-height: normal;
}

.form .input-wrapper label {
  display: flex;
  align-items: center;
}

.input {
  width: 180px;
  height: 100%;
  background-color: #d4d4d4;
  border-radius: 6px;
  border: none;
  font-family: Verdana;
  font-size: 16px;
  padding-left: 10px;
}

.form .input-wrapper div p {
  color: red;
  font-size: 10px;
  margin-top: -1px;
}

.grecaptcha-badge {
  display: none !important;
}

.error {
  border: 1px solid red !important;
}

.form .input-wrapper input:focus {
  outline: none;
}
@media (min-width: 375px) {
  .wrapper-form {
    width: 343px;
  }
  .form .input-wrapper {
    width: 327px;
  }
  .input {
    width: 232px;
  }
}

@media (min-width: 768px) {
  .wrapper-page {
    min-height: calc(100vh - 294px);
  }

  .wrapper-form {
    width: 608px;
    margin: 0 auto 12px auto;
  }
  .name-form {
    width: 325px;
    height: 40px;
  }

  .name-form p {
    font-size: 20px;
    font-style: normal;
    font-weight: 400;
  }

  .form {
    padding: 16px 24px;
  }

  .form .input-wrapper {
    width: 528px;
    height: 36px;
    margin: 0 auto 16px auto;

    font-size: 18px;
  }

  .form .input-wrapper .input {
    width: 391px;
    height: 34px;
  }
}

@media (min-width: 1440px) {
  .wrapper-page {
    height: calc(100vh - 247px);
  }
}
</style>