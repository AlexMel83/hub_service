<template>
  <Form class="wrapper-book" @submit="onSubmit">
    <h1>Забронювати коворкінг</h1>
    <div class="input-wrapper">
      <input
        :class="{ 'input-error': errors.nameValidation }"
        @input="onInput"
        placeholder="Ім'я*"
        type="text"
        name="name"
        maxlength="30"
        v-bind="nameValidation"
      />
      <div class="error-text">
        {{ errors.nameValidation }}
      </div>
    </div>
    <div class="input-wrapper">
      <input
        :class="{ 'input-error': errors.emailValidation }"
        placeholder="Email*"
        name="email"
        type="email"
        maxlength="30"
        v-bind="emailValidation"
      />
      <div class="error-text">
        {{ errors.emailValidation }}
      </div>
    </div>
    <div class="input-wrapper">
      <input
        :class="{ 'input-error': errors.phoneValidation }"
        placeholder="Телефон*"
        name="phone"
        @input="onInputPhone"
        type="text"
        v-bind="phoneValidation"
      />
      <div class="error-text">
        {{ errors.phoneValidation }}
      </div>
    </div>
    <div class="input-wrapper-date">
      <div class="input-wrapper-date-first">
        <span>Дата з</span>
        <input
          v-model="firstDate"
          class="time-date"
          type="date"
          :min="getCurrentDate()"
        />
      </div>
      <div class="input-wrapper-date-second">
        <span>до</span>
        <input
          v-model="lastDate"
          class="time-date"
          type="date"
          :min="firstDate"
        />
      </div>
    </div>
    <div class="input-wrapper-time">
      <div class="input-wrapper-time-first">
        <span>Час з</span>
        <input v-model="firstTime" class="time-date" type="time" />
      </div>
      <div class="input-wrapper-time-second">
        <span>до</span>
        <input v-model="lastTime" class="time-date" type="time" />
      </div>
    </div>
    <div class="input-wrapper-person">
      <span>Кількість осіб</span>
      <div class="input-wrapper-icon">
        <input
          v-model="people"
          type="text"
          @click="onPersonInput"
          maxlength="3"
        />
        <img src="~assets/icon_amount.png" alt="icon" />
      </div>
    </div>
    <button type="submit">Забронювати</button>
    <TheModal
      @close="closeModal"
      v-if="isShownModal"
      :title="modalTitle"
      :description="modalDescription"
    />
  </Form>
</template>

<script setup>
import * as yup from "yup";
import { useForm } from "vee-validate";
import { useReCaptcha } from "vue-recaptcha-v3";
import axios from "axios";
import { ref } from "vue";
const bus = useNuxtApp().$bus;

const { defineInputBinds, errors, handleSubmit } = useForm({
  validationSchema: yup.object({
    nameValidation: yup
      .string()
      .required("Це поле є обов’язковим для заповнення")
      .matches(/^[a-zA-Zа-яА-ЯЁё\s]{2,}$/, "Поле заповнено невірно"),
    emailValidation: yup
      .string()
      .email("Поле заповнено некоректно")
      .required("Це поле є обов’язковим для заповнення")
      .matches(
        /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,})+$/,
        "Поле заповнено невірно"
      ),
    phoneValidation: yup
      .string()
      .required("Це поле є обов’язковим для заповнення")
      .matches(
        /^\+38 \(0[1-9]\d{1}\) \d{3} \d{2} \d{2}$/,
        "Поле заповнено невірно"
      ),
  }),
});
var modalTitle = ref("");
var modalDescription = ref("");
var isShownModal = ref(false);
const nameValidation = defineInputBinds("nameValidation");
const emailValidation = defineInputBinds("emailValidation");
const phoneValidation = defineInputBinds("phoneValidation");
const recaptchaInstance = useReCaptcha();
let firstDate = ref(getCurrentDate());
let lastDate = ref("відсутнє");
let firstTime = ref("відсутнє");
let lastTime = ref("відсутнє");
let people = ref("1");
function closeModal() {
  isShownModal.value = false;
  //   bus.$emit("Modal", {
  //     openModal: false,
  //   });
  //   document.body.style.position = "";
}

function getCurrentDate() {
  const today = new Date();
  const year = today.getFullYear();
  let month = today.getMonth() + 1;
  let day = today.getDate();
  month = month < 10 ? `0${month}` : month;
  day = day < 10 ? `0${day}` : day;

  return `${year}-${month}-${day}`;
}

function onPersonInput(event) {
  event.target.value = event.target.value.replace(/\D/g, "");
}

const onSubmit = handleSubmit(async (values) => {
  try {
    const newToken = ref(null);
    const recaptcha = async () => {
      await recaptchaInstance?.recaptchaLoaded();
      newToken.value = await recaptchaInstance?.executeRecaptcha(
        "yourActionHere"
      );
      return newToken;
    };
    await recaptcha();

    let formData = new FormData();
    formData.append("first_name", values.nameValidation);
    formData.append("email", values.emailValidation);
    formData.append("phone", values.phoneValidation);
    formData.append(
      "comments",
      JSON.stringify([
        { firstDate: firstDate.value, lastDate: lastDate.value },
        { firstTime: firstTime.value, lastTime: lastTime.value },
        { people: people.value },
      ])
    );
    formData.append("g-recaptcha-response", newToken.value);
    formData.append("organization_id", "1");
    await axios.post("https://intita.com/api/v1/entrant", formData);
    modalTitle.value = "Дякуємо!";
    modalDescription.value =
      "Менеджер зв’яжеться з Вами найближчим часом для підтвердження бронювання.";
  } catch (error) {
    console.log(error);
    modalTitle.value = "";
    modalDescription.value =
      "Сервер тимчасово перевантажений. Будь ласка, cпробуйте пізніше";
  } finally {
    isShownModal.value = true;
  }
});

function onInput(event) {
  event.target.value = event.target.value.replace(
    /[^a-zA-Zа-яА-ЯїЇєЄіІґҐ'-]/g,
    ""
  );
}

function onInputPhone(event) {
  event.target.value = event.target.value
    .replace("+38 (0", "")
    .replace(/\D/g, "")
    .slice(0, 9);
  const phoneRegex = /^(\d{0,2})(\d{0,3})(\d{0,2})(\d{0,2})$/;

  event.target.value = event.target.value.replace(
    phoneRegex,
    (_match, p1, p2, p3, p4) => {
      const formattedNumber = [];

      if (p1) {
        formattedNumber.push(`+38 (0${p1}`);
      }
      if (p2) {
        formattedNumber.push(`) ${p2}`);
      }
      if (p3) {
        formattedNumber.push(` ${p3}`);
      }
      if (p4) {
        formattedNumber.push(` ${p4}`);
      }

      return formattedNumber.join("");
    }
  );
  phoneValidation = event.target.value;
}
</script>

<style>
.wrapper-book {
  display: flex;
  flex-direction: column;
  align-items: center;
  width: 300px;
  padding: 0 24px;
  font-family: Inter;
  font-weight: 400;
  line-height: 140%;
  font-size: 18px;
  color: var(--book-form);
}

.wrapper-book h1 {
  font-size: 20px;
  font-weight: 700;
  line-height: normal;
  margin: 16px 0 32px 0;
  color: var(--black-color);
}

.wrapper-book .input-wrapper {
  width: 100%;
  height: 36px;
  margin-bottom: 18px;
}

.wrapper-book .input-wrapper input {
  width: 100%;
  height: 100%;
}

.wrapper-book input {
  border-radius: 10px;
  border: 1px solid var(--black-color);
  padding: 12px 6px;
}

.wrapper-book input:focus {
  outline: none;
}

.wrapper-book input:autofill {
  transition: background-color 5000s ease-in-out 0s;
  -webkit-text-fill-color: var(--black-color);
}

.wrapper-book .input-wrapper input.input-error {
  border: 1px solid var(--error);
}

.wrapper-book button {
  width: 250px;
  height: 46px;
  border: none;
  border-radius: 10px;
  cursor: pointer;
  font-style: normal;
  line-height: normal;
  margin-top: 24px;
  background-color: var(--text-color);
  color: var(--white-color);
}

button:hover {
  background-color: var(--btn-border);
}

button:active {
  background-color: var(--text-color);
  border: 1px solid var(--btn-border);
}

.error-text {
  color: var(--error);
  font-size: 12px;
}

.input-wrapper-time,
.input-wrapper-date {
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  width: 100%;
  height: 90px;
  margin-bottom: 18px;
}

.input-wrapper-time .input-wrapper-time-first,
.input-wrapper-time .input-wrapper-time-second,
.input-wrapper-date .input-wrapper-date-first,
.input-wrapper-date .input-wrapper-date-second {
  display: flex;
  flex-direction: row;
  justify-content: space-between;
  align-items: center;
  width: 100%;
  height: 36px;
}

.input-wrapper-time input,
.input-wrapper-date input {
  width: 166px;
  height: 36px;
}

.input-wrapper-person {
  display: flex;
  flex-direction: row;
  justify-content: space-around;
  align-items: center;
  width: 100%;
  height: 36px;
}
.input-wrapper-person .input-wrapper-icon input {
  border: none;
  width: 100%;
  padding: 0 0 0 6px;
  height: 36px;
}

.input-wrapper-icon {
  border-radius: 10px;
  border: 1px solid var(--black-color);
  display: flex;
  flex-direction: row;
  width: 143px;
}

.input-wrapper-icon img {
  width: 17px;
  height: 17px;
  margin: auto 12px;
}

@media (min-width: 375px) {
  .wrapper-book {
    width: 350px;
  }
  .wrapper-book h1 {
    font-size: 24px;
  }
  .wrapper-book button {
    width: 306px;
  }

  .input-wrapper-time input,
  .input-wrapper-date input {
    width: 218px;
  }

  .input-wrapper-person {
    width: 327px;
  }
}

@media (min-width: 768px) {
  .wrapper-book {
    width: 500px;
  }

  .input-wrapper-time,
  .input-wrapper-date {
    flex-direction: row;
    width: 100%;
    height: 36px;
    margin-bottom: 18px;
  }

  .input-wrapper-time .input-wrapper-time-first,
  .input-wrapper-date .input-wrapper-date-first {
    width: 300px;
    height: 100%;
    margin: 0 auto 16px auto;
  }

  .input-wrapper-time-first input,
  .input-wrapper-time-second input,
  .input-wrapper-date-first input,
  .input-wrapper-date-second input {
    width: 150px;
    height: 100%;
  }

  .input-wrapper-time .input-wrapper-time-second,
  .input-wrapper-date .input-wrapper-date-second {
    width: 228px;
    height: 100%;
  }

  .input-wrapper-time-second span,
  .input-wrapper-date-second span {
    width: 49px;
    font-size: 20px;
    text-align: center;
  }

  .input-wrapper-person {
    width: 431px;
  }
  .input-wrapper-icon {
    width: 223px;
  }
}
</style>