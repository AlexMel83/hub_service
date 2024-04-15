<template>
  <form class="wrapper-book" @submit="onSubmit">
    <h1>Забронювати простір</h1>
    <div v-if="!authUser().name" class="input-wrapper">
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
    <div v-if="!authUser().surname" class="input-wrapper">
      <input
        :class="{ 'input-error': errors.surnameValidation }"
        @input="onInput"
        placeholder="Прізвище*"
        type="text"
        name="name"
        maxlength="30"
        v-bind="surnameValidation"
      />
      <div class="error-text">
        {{ errors.surnameValidation }}
      </div>
    </div>
    <div v-if="!authUser().email" class="input-wrapper">
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
    <div v-if="!authUser().phone" class="input-wrapper">
      <input
        :class="{ 'input-error': errors.phoneValidation }"
        placeholder="+38"
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
        <span>Дата</span>
        <div class="error-wrapper">
          <input
            v-bind="firstDateValidation"
            class="time-date"
            :class="{ 'input-error': errors.firstDateValidation }"
            type="date"
            :min="getCurrentDate()"
          />
          <div class="error-text">
            {{ errors.firstDateValidation }}
          </div>
        </div>
      </div>
      <!-- <div class="input-wrapper-date-second">
        <span>до</span>
        <input
          v-model="lastDate"
          class="time-date"
          type="date"
          :min="firstDate"
        />
      </div> -->
    </div>
    <div class="input-wrapper-time">
      <div class="input-wrapper-time-first">
        <span>Час з</span>
        <div class="error-wrapper">
          <input
            v-bind="firstTimeValidation"
            class="time-date"
            :class="{ 'input-error': errors.firstTimeValidation }"
            type="time"
          />
          <div class="error-text">
            {{ errors.firstTimeValidation }}
          </div>
        </div>
      </div>
      <div class="input-wrapper-time-second">
        <span>до</span>
        <div class="error-wrapper">
          <input
            v-bind="lastTimeValidation"
            class="time-date"
            :class="{ 'input-error': errors.lastTimeValidation }"
            type="time"
          />
          <div class="error-text">
            {{ errors.lastTimeValidation }}
          </div>
        </div>
      </div>
    </div>
    <div class="input-wrapper-person">
      <span>Кількість осіб</span>
      <div class="error-wrapper">
        <div
          class="input-wrapper-icon"
          :class="{ 'input-error': errors.peopleValidation }"
        >
          <input
            @input="onPersonInput"
            v-bind="peopleValidation"
            type="text"
            maxlength="3"
          />
          <img src="~assets/icon_amount.png" alt="icon" />
        </div>
        <div class="error-text">
          {{ errors.peopleValidation }}
        </div>
      </div>
    </div>
    <button type="submit">Забронювати</button>
    <TheModal
      @close="closeModal"
      v-if="isShownModal"
      :title="modalTitle"
      :description="modalDescription"
    />
  </form>
</template>

<script setup>
import * as yup from "yup";
import { useForm } from "vee-validate";
import { ref } from "vue";
import { useStore } from "vuex";
const store = useStore();
const bus = useNuxtApp().$bus;
const { $api } = useNuxtApp();

const { defineInputBinds, errors, handleSubmit, setFieldValue } = useForm({
  validationSchema: yup.object({
    nameValidation: yup
      .string()
      .required("Це поле є обов’язковим для заповнення")
      .matches(/^[a-zA-Zа-яА-ЯїЇєЄіІґҐ' -\s]{2,}$/, "Поле заповнено невірно"),
    surnameValidation: yup
      .string()
      .required("Введіть Ваше прізвище")
      .matches(
        /^[a-zA-Zа-яА-ЯїЇєЄіІґҐ' -\s]{2,}$/,
        "Поле заповнено некоректно",
      ),
    emailValidation: yup
      .string()
      .email("Поле заповнено некоректно")
      .required("Це поле є обов’язковим для заповнення")
      .matches(
        /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,})+$/,
        "Поле заповнено невірно",
      ),
    phoneValidation: yup
      .string()
      .required("Введіть Ваш номер телефону")
      .matches(/^380\d{9}$/, "Поле заповнено некоректно"),
    firstDateValidation: yup.string().required("Введіть дату"),
    firstTimeValidation: yup.string().required("Введіть час"),
    lastTimeValidation: yup
      .string()
      .required("Введіть час")
      .test("is-later", "Час вказан невірно", function (value, context) {
        const firstTime = context.parent.firstTimeValidation;
        const firstDate = context.parent.firstDateValidation;
        return (
          new Date(`${firstDate} ${firstTime}`) <
          new Date(`${firstDate} ${value}`)
        );
      }),
    peopleValidation: yup.string().required("Введіть кількість осіб"),
  }),
});
var modalTitle = ref("");
var modalDescription = ref("");
var isShownModal = ref(false);
const nameValidation = defineInputBinds("nameValidation");
const surnameValidation = defineInputBinds("surnameValidation");
const emailValidation = defineInputBinds("emailValidation");
const phoneValidation = defineInputBinds("phoneValidation");
const firstDateValidation = defineInputBinds("firstDateValidation");
const firstTimeValidation = defineInputBinds("firstTimeValidation");
const lastTimeValidation = defineInputBinds("lastTimeValidation");
const peopleValidation = defineInputBinds("peopleValidation", "1");

const authUser = () => {
  return store.state.authUser;
};
watchEffect(() => {
  authUser().name ? setFieldValue("nameValidation", authUser().name) : null;
  authUser().email ? setFieldValue("emailValidation", authUser().email) : null;
  authUser().phone ? setFieldValue("phoneValidation", authUser().phone) : null;
  authUser().surname
    ? setFieldValue("surnameValidation", authUser().surname)
    : null;

  setFieldValue("firstDateValidation", getCurrentDate());
  setFieldValue("peopleValidation", 1);
});

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

function bookSpace(values) {
  const price = () => {
    let currentTime =
      (new Date(
        `${values.firstDateValidation}T${values.lastTimeValidation}:00`,
      ) -
        new Date(
          `${values.firstDateValidation}T${values.firstTimeValidation}:00`,
        )) /
      (1000 * 60);
    if (currentTime <= 60) {
      return store.state.currentBookSpace.price;
    } else {
      return Math.ceil(
        Math.ceil(currentTime / 30) * (store.state.currentBookSpace.price / 2),
      );
    }
  };
  try {
    $api
      .post("/bookings", {
        spaceId: store.state.currentBookSpace.id,
        startTime: `${values.firstDateValidation}T${values.firstTimeValidation}:00Z`,
        endTime: `${values.firstDateValidation}T${values.lastTimeValidation}:00Z`,
        seats: values.peopleValidation,
        totalPrice: price(),
        firstName: values.nameValidation,
        lastName: values.surnameValidation,
        email: values.emailValidation,
        phone: values.phoneValidation,
      })
      .then((response) => {
        if (response.data) {
          bus.$emit("Modal", {
            openModal: true,
            showLogin: false,
            showRegistration: false,
            showBookSpace: false,
            textModalMessage: ` ${values.nameValidation}, наш менеджер зв’яжеться з Вами найближчим часом для підтвердження бронювання`,
          });
        }
      });
  } catch (error) {
    console.log(error);
  }
}

const onSubmit = handleSubmit(async (values) => {
  const bookAuthUser = () => {
    if (authUser().name && authUser().email && authUser().surname) {
      try {
        $api.get(`/users?id=${store.state.authUser.id}`).then((response) => {
          if (response.data.id) {
            bookSpace(values);
          }
        });
      } catch (error) {
        console.log(error);
      }
    } else {
      try {
        $api
          .put("/users/", {
            id: authUser().id,
            email: values.emailValidation,
            name: values.nameValidation,
            surname: values.surnameValidation,
            phone: values.phoneValidation,
          })
          .then((response) => {
            if (response.data) {
              try {
                $api
                  .get(`/users?id=${store.state.authUser.id}`)
                  .then((response) => {
                    store.commit("getUserData", response.data);
                    if (response.data.id) {
                      bookSpace(values);
                    }
                  });
              } catch (error) {
                console.log(error);
              }
            }
          });
      } catch (error) {
        console.log(error);
      }
    }
  };
  authUser().id ? bookAuthUser() : bookSpace(values);
});

function onInput(event) {
  event.target.value = event.target.value.replace(
    /[^a-zA-Zа-яА-ЯїЇєЄіІґҐ'-]/g,
    "",
  );
}

function onInputPhone(event) {
  event.target.value = event.target.value
    .replace("38", "")
    .replace(/\D/g, "")
    .slice(0, 10);
  const phoneRegex = /^(\d{0,3})(\d{0,3})(\d{0,2})(\d{0,2})$/;

  event.target.value = event.target.value.replace(
    phoneRegex,
    (_match, p1, p2, p3, p4) => {
      const formattedNumber = [];
      if (p1) {
        formattedNumber.push(`38${p1}`);
      }
      if (p2) {
        formattedNumber.push(`${p2}`);
      }
      if (p3) {
        formattedNumber.push(`${p3}`);
      }
      if (p4) {
        formattedNumber.push(`${p4}`);
      }

      return formattedNumber.join("");
    },
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
.wrapper-book .error-wrapper {
  height: 36px;
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

.wrapper-book .input-wrapper-person .input-error,
.wrapper-book .input-wrapper-time input.input-error,
.wrapper-book .input-wrapper-date input.input-error,
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

.input-wrapper-time {
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  width: 100%;
  height: 90px;
  margin-bottom: 18px;
}

.input-wrapper-date {
  display: flex;
  flex-direction: row;
  width: 100%;
  height: 36px;
}

.input-wrapper-time .input-wrapper-time-first,
.input-wrapper-time .input-wrapper-time-second {
  display: flex;
  flex-direction: row;
  justify-content: space-between;
  align-items: center;
  width: 100%;
  height: 36px;
}

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
    justify-content: flex-start;
    width: 100%;
    height: 36px;
    margin-bottom: 18px;
  }

  .input-wrapper-time .input-wrapper-time-first {
    width: 300px;
    height: 100%;
    margin: 0 auto 16px auto;
  }

  .input-wrapper-date .input-wrapper-date-first {
    width: 253px;
    height: 100%;
    margin: 0 0 16px 0;
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

  .input-wrapper-date-second span {
    margin-right: 50px;
  }

  .input-wrapper-person {
    width: 431px;
  }
  .input-wrapper-icon {
    width: 223px;
  }
}
</style>
