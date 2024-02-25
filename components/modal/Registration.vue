<template>
  <Form class="wrapper" @submit="onSubmit">
    <h1>Зареєструватися</h1>
    <div class="user-selection">
      <div>
        <input
          @click="showRegUser"
          type="radio"
          id="user"
          checked="true"
          name="fav_language"
        />
        <label for="user">Користувач</label><br />
      </div>
      <div>
        <input
          @click="showRegUser"
          type="radio"
          id="space"
          name="fav_language"
        />
        <label for="space">Менеджер</label><br />
      </div>
    </div>
    <div v-if="showRegistrationUser" class="user-registration">
      <div class="login-using">
        <div class="login-using-item">
          <img src="~assets/icon_google.png" alt="google" />
        </div>
        <div class="login-using-item">
          <img src="~assets/icon_facebook.png" alt="facebook" />
        </div>
      </div>
      <div class="input-wrapper">
        <input
          name="email"
          :class="{ 'input-error': errors.emailValidation }"
          placeholder="E-mail*"
          type="email"
          maxlength="30"
          v-bind="emailValidation"
          @input="emailError = ''"
        />
        <div class="error-text">
          {{ errors.emailValidation }}
          {{ emailError }}
        </div>
      </div>
      <div
        class="input-wrapper input-password-wrapper"
        :class="{ 'input-error': errors.passwordValidation }"
      >
        <div class="input-password">
          <input
            :type="isShowPassword ? 'text' : 'password'"
            maxlength="30"
            name="password"
            placeholder="Пароль*"
            v-bind="passwordValidation"
          />
          <div class="show-password">
            <img
              v-if="isShowPassword"
              @click="showPassword"
              src="~assets/icon_show_password.png"
              alt="show"
            />
            <img
              v-else
              @click="showPassword"
              src="~assets/icon_close_password.png"
              alt="close"
            />
          </div>
        </div>
        <div class="error-text">
          {{ errors.passwordValidation }}
        </div>
      </div>
      <div
        class="input-wrapper input-password-wrapper indent"
        :class="{ 'input-error': errors.confirmPasswordValidation }"
      >
        <div class="input-password">
          <input
            :type="isShowRepeatPassword ? 'text' : 'password'"
            maxlength="30"
            name="repeatPassword"
            placeholder="Підтвердити пароль*"
            v-bind="confirmPasswordValidation"
          />
          <div class="show-password">
            <img
              v-if="isShowRepeatPassword"
              @click="showRepeatPassword"
              src="~assets/icon_show_password.png"
              alt="show"
            />
            <img
              v-else
              @click="showRepeatPassword"
              src="~assets/icon_close_password.png"
              alt="close"
            />
          </div>
        </div>
        <div class="error-text">
          {{ errors.confirmPasswordValidation }}
        </div>
      </div>
    </div>
    <div v-else class="space-registration">
      <div class="input-wrapper">
        <input
          :class="{ 'input-error': errors.coworkingNameValidation }"
          name="spaceName"
          type="text"
          placeholder="Назва коворкінгу*"
          maxlength="30"
          v-bind="coworkingNameValidation"
        />
        <div class="error-text">
          {{ errors.coworkingNameValidation }}
        </div>
      </div>
      <div class="input-wrapper">
        <input
          :class="{ 'input-error': errors.emailValidation }"
          placeholder="E-mail*"
          name="email"
          type="email"
          maxlength="30"
          v-bind="emailValidation"
        />
        <div class="error-text">
          {{ errors.emailValidation }}
        </div>
      </div>

      <div
        class="input-wrapper input-password-wrapper"
        :class="{ 'input-error': errors.passwordValidation }"
      >
        <div class="input-password">
          <input
            :type="isShowPassword ? 'text' : 'password'"
            maxlength="30"
            name="password"
            placeholder="Пароль*"
            v-bind="passwordValidation"
            @input="passwordError = ''"
          />
          <div class="show-password">
            <img
              v-if="isShowPassword"
              @click="showPassword"
              src="~assets/icon_show_password.png"
              alt="show"
            />
            <img
              v-else
              @click="showPassword"
              src="~assets/icon_close_password.png"
              alt="close"
            />
          </div>
        </div>
        <div class="error-text">
          {{ errors.passwordValidation }}
          {{ passwordError }}
        </div>
      </div>
      <div
        class="input-wrapper input-password-wrapper indent"
        :class="{ 'input-error': errors.confirmPasswordValidation }"
      >
        <div class="input-password">
          <input
            :type="isShowRepeatPassword ? 'text' : 'password'"
            maxlength="30"
            name="repeatPassword"
            placeholder="Підтвердити пароль*"
            v-bind="confirmPasswordValidation"
          />
          <div class="show-password">
            <img
              v-if="isShowRepeatPassword"
              @click="showRepeatPassword"
              src="~assets/icon_show_password.png"
              alt="show"
            />
            <img
              v-else
              @click="showRepeatPassword"
              src="~assets/icon_close_password.png"
              alt="close"
            />
          </div>
        </div>
        <div class="error-text">
          {{ errors.confirmPasswordValidation }}
        </div>
      </div>
    </div>
    <RegLoginButton textContent="Зареєструватися" />
  </Form>
  <button class="link-btn" @click="openLogin">Увійти</button>
</template>

<script setup>
import * as yup from "yup";
import { useForm } from "vee-validate";
import { ref } from "vue";
import RegLoginButton from "~/components/modal/RegLoginButton.vue";
const bus = useNuxtApp().$bus;

const { defineInputBinds, errors, handleSubmit } = useForm({
  validationSchema: yup.object({
    coworkingNameValidation: yup.string(),
    //   .required("Це поле є обов’язковим для заповнення")
    //   .min(2, "Назва повинна містити принаймні 2 символа"),
    emailValidation: yup
      .string()
      .email("поле заповнено некоректно")
      .required("Це поле є обов’язковим для заповнення")
      .matches(
        /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,})+$/,
        "Поле заповнено невірно"
      ),
    passwordValidation: yup
      .string()
      .required("Це поле є обов’язковим для заповнення")
      .min(2, "Пароль повинен містити принаймні 2 символа"),
    confirmPasswordValidation: yup
      .string()
      .required("Це поле є обов’язковим для заповнення")
      .oneOf(
        [yup.ref("passwordValidation"), null],
        "Паролі повинні співпадати"
      ),
  }),
});
const coworkingNameValidation = defineInputBinds("coworkingNameValidation");
const emailValidation = defineInputBinds("emailValidation");
const passwordValidation = defineInputBinds("passwordValidation");
const confirmPasswordValidation = defineInputBinds("confirmPasswordValidation");
const isShowPassword = ref(false);
const isShowRepeatPassword = ref(false);
const showRegistrationUser = ref(true);
const userRole = ref("user");
const { $api } = useNuxtApp();
let emailError = ref("");
const onSubmit = handleSubmit(async (values) => {
  try {
    await $api
      .post("/registration", {
        email: values.emailValidation,
        password: values.passwordValidation,
        role: userRole.value,
      })
      .then((response) => {
        emailError.value = "";
        bus.$emit("Modal", {
          openModal: true,
          showLogin: false,
          showRegistration: false,
          textModalMessage:
            "На зазначену Вами електронну пошту надіслано лист з посиланням, перейдіть по ньому для активації аккаунту.",
        });
      });
  } catch (error) {
    if (error.response.data.message.includes("already exist")) {
      emailError.value = "даний email вже зареєстрований";
    }
  }
});

function showPassword() {
  isShowPassword.value = !isShowPassword.value;
}

function showRepeatPassword() {
  isShowRepeatPassword.value = !isShowRepeatPassword.value;
}

function showRegUser() {
  showRegistrationUser.value = !showRegistrationUser.value;
  showRegistrationUser.value
    ? (userRole.value = "user")
    : (userRole.value = "manager");
}
</script>
 
<script>
export default {
  methods: {
    openLogin() {
      this.$emit("openLoginComponent");
    },
  },
};
</script>
  <style scoped>
.error-text {
  color: red;
  font-size: 12px;
}

.wrapper .input-error,
.wrapper input.input-error {
  border: 1px solid red;
}

.wrapper {
  width: 100%;
  height: 100%;
  padding: 0px 16px 0px 16px;
  display: flex;
  flex-direction: column;
  align-items: center;
  font-family: Inter;
  color: var(--white-color);
  font-weight: 400;
  font-style: normal;
}

.wrapper h1 {
  font-size: 32px;
  font-weight: 700;
  line-height: normal;
  margin-bottom: 20px;
}

.user-selection {
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  font-size: 18px;
  line-height: normal;
  height: 80px;
  margin-bottom: 12px;
}

.user-selection input {
  margin-bottom: 10px;
}

.space-registration,
.user-registration {
  width: 100%;
  display: flex;
  flex-direction: column;
  align-items: center;
}

.user-registration .login-using {
  width: 166px;
  height: 60px;
  display: flex;
  flex-direction: row;
  justify-content: space-between;
  margin-bottom: 24px;
  margin-top: -2px;
}

.user-registration .login-using .login-using-item {
  height: 100%;
  width: 60px;
  border: 1px solid #a9a9a9;
  border-radius: 5px;
  display: flex;
  flex-direction: row;
  justify-content: center;
  align-items: center;
  cursor: pointer;
}

.input-wrapper input,
.user-registration .user-name input {
  width: 100%;
  height: 100%;
}

input:focus {
  outline: none;
}

input {
  padding-left: 8px;
  font-size: 18px;
  line-height: normal;
  border-radius: 10px;
  background-color: var(--white-color);
}

input:autofill {
  transition: background-color 5000s ease-in-out 0s;
  -webkit-text-fill-color: black;
}

.link-btn,
.input-wrapper {
  width: 100%;
  height: 48px;
  font-size: 16px;
  line-height: 140%;
  margin-bottom: 24px;
}

.input-password-wrapper {
  border-radius: 10px;
  background-color: var(--white-color);
}

.indent {
  margin-bottom: 12px;
}
.input-password {
  width: 100%;
  height: 100%;
  display: flex;
  flex-direction: row;
}

.input-password .show-password {
  height: 100%;
  width: 56px;
  background-color: transparent;
  display: flex;
  flex-direction: row;
  align-items: center;
  justify-content: center;
}

.show-password img {
  cursor: pointer;
}

input[type="radio"] {
  display: none;
}

label {
  position: relative;
  cursor: pointer;
  user-select: none;
  font-size: 18px;
  margin-bottom: -10px;
}

label:before {
  content: "";
  width: 34px;
  height: 34px;
  border: 1px solid var(--white-color);
  border-radius: 50%;
  background-color: transparent;
  box-sizing: border-box;
  display: inline-block;
  vertical-align: middle;
  margin-right: 12px;
}

label:after {
  content: "";
  position: absolute;
  left: 5px;
  top: 4.5px;
  width: 24px;
  height: 24px;
  border-radius: 50%;
  background-color: var(--white-color);
  opacity: 0;
  display: inline-block;
  vertical-align: middle;
}

input[type="radio"]:checked + label:after {
  opacity: 1;
}

.link-btn {
  margin: 24px 0 32px 0;
  font-size: 18px;
}

@media (min-width: 375px) {
  .wrapper {
    width: 375px;
  }
  .user-registration .else .login-line {
    width: 131px;
  }
}

@media (min-width: 768px) {
  .wrapper {
    width: 525px;
    padding: 0px 24px;
    color: var(--black-color);
  }

  .wrapper h1 {
    margin-bottom: 21px;
    font-size: 24px;
  }
  .user-selection {
    height: 62px;
    margin-bottom: 12px;
  }

  label:before {
    width: 24px;
    height: 24px;
    border: 1px solid var(--text-color);
    background-color: var(--white-color);
  }

  label:after {
    left: 4px;
    width: 16px;
    height: 16px;
    background-color: var(--text-color);
  }

  input {
    border: 1px solid var(--text-color);
  }

  .input-password input {
    border: none;
  }

  .input-password-wrapper {
    border: 1px solid var(--text-color);
  }

  .link-btn {
    display: none;
  }
}
</style>
  