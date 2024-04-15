<template>
  <form
    class="wrapper-manager-coworking edit-coworking"
    style="min-height: 100vh"
    @submit="onSubmit"
  >
    <div class="basic-information">
      <h2 class="indent-mng-bnt">Інформація профілю</h2>

      <div class="info-wrapper">
        <div class="property">E-mail</div>
        <div class="value">
          <input
            class="basic-inp"
            type="text"
            :class="{ 'input-error': errors.emailValidation }"
            v-bind="emailValidation"
            placeholder="Ваш e-mail"
            readonly
            style="border: none"
          />
          <div class="error-text">
            {{ errors.emailValidation }}
          </div>
        </div>
      </div>
      <div class="info-wrapper">
        <div class="property">Ім'я</div>
        <div class="value">
          <input
            class="basic-inp"
            type="text"
            @input="onInput"
            :class="{ 'input-error': errors.nameValidation }"
            v-bind="nameValidation"
            placeholder="Ваше ім'я"
          />
          <div class="error-text">
            {{ errors.nameValidation }}
          </div>
        </div>
      </div>
      <div class="info-wrapper">
        <div class="property">Прізвище</div>
        <div class="value">
          <input
            class="basic-inp"
            type="text"
            @input="onInput"
            :class="{ 'input-error': errors.surnameValidation }"
            v-bind="surnameValidation"
            placeholder="Ваше прізвище"
          />
          <div class="error-text">
            {{ errors.surnameValidation }}
          </div>
        </div>
      </div>
      <div class="info-wrapper">
        <div class="property">Контактний телефон</div>
        <div class="value">
          <input
            class="basic-inp"
            type="text"
            :class="{ 'input-error': errors.phoneValidation }"
            @input="onInputPhone"
            v-bind="phoneValidation"
            placeholder="+38"
          />
          <div class="error-text">
            {{ errors.phoneValidation }}
          </div>
        </div>
      </div>
    </div>
    <div class="edit-button">
      <button class="btn edit" type="submit">Зберегти</button>
    </div>
  </form>
</template>
<script setup>
import { useRouter } from "vue-router";
import { useStore } from "vuex";
import * as yup from "yup";
import { useForm } from "vee-validate";
const router = useRouter();
const store = useStore();
const authUser = () => {
  return store.state.authUser;
};
definePageMeta({
  layout: "layout-auth-users",
});

const { defineInputBinds, errors, handleSubmit, setFieldValue } = useForm({
  validationSchema: yup.object({
    nameValidation: yup
      .string()
      .required("Введіть Ваше Ім'я")
      .matches(
        /^[a-zA-Zа-яА-ЯїЇєЄіІґҐ' -\s]{2,}$/,
        "Поле заповнено некоректно",
      ),
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
  }),
});

const emailValidation = defineInputBinds("emailValidation");
const nameValidation = defineInputBinds("nameValidation");
const surnameValidation = defineInputBinds("surnameValidation");
const phoneValidation = defineInputBinds("phoneValidation");

watchEffect(() => {
  if (authUser()) {
    setFieldValue("emailValidation", authUser().email);
    setFieldValue("nameValidation", authUser().name);
    setFieldValue("surnameValidation", authUser().surname);
    setFieldValue("phoneValidation", authUser().phone);
  }
});

const onSubmit = handleSubmit(async (values) => {
  try {
    const { $api } = useNuxtApp();
    $api
      .put("/users/", {
        id: authUser().id,
        email: values.emailValidation,
        name: values.nameValidation,
        surname: values.surnameValidation,
        phone: values.phoneValidation,
      })
      .then((response) => {
        if (response) {
          router.push("/user");
        }
      });
  } catch (error) {
    console.log(error);
  }
});

function onInput(event) {
  event.target.value = event.target.value.replace(
    /[^a-zA-Zа-яА-ЯїЇєЄіІґҐ' - \s]/g,
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

function setUserData() {
  if (localStorage.getItem("userData")) {
    store.commit("setUserData", JSON.parse(localStorage.getItem("userData")));
  }
}
function setActiveTab() {
  store.state.activeTabAuthUserMenu = "profileActive";
}

onMounted(() => {
  setUserData();
  setActiveTab();
});
</script>

<style>
.indent-mng-bnt {
  text-align: left;
}

.btn-edit {
  position: absolute;
  background-color: #09273b;
  top: 16px;
  right: 0px;
  width: 46px;
  height: 46px;
  border-radius: 6px;
}

.wrapper-manager-coworking {
  display: flex;
  flex-direction: column;
  font-family: Inter;
  font-size: 20px;
  font-style: normal;
  font-weight: 400;
  line-height: normal;
  position: relative;
  padding-bottom: 140px;
  color: var(--black-color);
}

.wrapper-manager-coworking h2 {
  margin: 24px;
  padding: 0;
  font-size: 20px;
  font-weight: 900;
}

.basic-information {
  padding-bottom: 32px;
  border-bottom: 2px solid var(--text-color);
}

.basic-information .info-wrapper {
  display: flex;
  flex-direction: column;
  justify-content: flex-start;
  margin-bottom: 24px;
}

.basic-information .info-wrapper .property {
  width: 100%;
  margin-right: 10px;
  margin-bottom: 12px;
}

.basic-information .basic-inp {
  width: 95%;
}

.edit-coworking {
  position: relative;
}

.edit-coworking .input-error {
  border: 1px solid red;
}

.edit-coworking input {
  border: 1px solid #a9a9a9;
  border-radius: 6px;
  padding: 5px;
}

.edit-button {
  display: flex;
  flex-direction: row;
  justify-content: flex-end;
}

.btn.edit {
  width: 200px;
  height: 46px;
  margin: 20px;
  color: var(--text-color);
  border-radius: 6px;
}

@media (min-width: 375px) {
  .indent-mng-bnt {
    text-align: center;
  }

  .basic-information .basic-inp {
    width: 343px;
  }
}

@media (min-width: 768px) {
  .btn-edit {
    top: 24px;
    right: 0px;
  }

  .wrapper-manager-coworking {
    padding-bottom: 110px;
  }

  .wrapper-manager-coworking h2 {
    margin: 32px;
    font-size: 24px;
  }

  .basic-information {
    padding-bottom: 42px;
  }

  .basic-information .info-wrapper {
    flex-direction: row;
    justify-content: flex-start;
  }

  .basic-information .info-wrapper .property {
    width: 35%;
    margin-bottom: 0px;
  }

  .basic-information .basic-inp {
    width: 300px;
  }
}

@media (min-width: 900px) {
  .basic-information .basic-inp {
    width: 400px;
  }
}
</style>
