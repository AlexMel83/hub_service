<template>
  <form v-if="!isRemove" class="wrapper-space-info">
    <div class="left-side">
      <div class="line-space"></div>
      <div class="line-space"></div>
      <div class="line-space"></div>
    </div>
    <div
      @click="showMoreInfo = !showMoreInfo"
      v-if="!showMoreInfo && !editSpace"
      class="less-info"
    >
      <span v-if="space">{{ space.space_name }}</span>
      <div class="less-info-function">
        <button @click="deleteSpace" class="function">
          <img src="~assets/icon_delete.png" alt="delete" />
        </button>
        <button
          @click.stop="(editSpace = true), (showMoreInfo = true)"
          class="function"
        >
          <img src="~assets/icon_edit.png" alt="edit" />
        </button>
      </div>
    </div>
    <div
      @click="showMoreInfo = !showMoreInfo"
      v-if="showMoreInfo || editSpace"
      class="more-info"
    >
      <div class="wrapper-more-info item-center">
        <div class="more-info-property">Назва простору</div>
        <div class="more-info-value space-inp">
          <input
            @input="onInput"
            v-bind="nameSpaceValidation"
            :class="[
              'input',
              { 'edit-space': editSpace },
              { 'input-error': errors.nameSpaceValidation },
            ]"
            :readonly="!editSpace"
            type="text"
            placeholder="Назва простору"
            maxlength="30"
          />
          <div class="error-text">
            {{ errors.nameSpaceValidation }}
          </div>
        </div>
      </div>
      <div class="wrapper-more-info item-center">
        <div class="more-info-property">Кількість місць</div>
        <div class="more-info-value space-inp">
          <input
            @input="onInputNumber"
            v-bind="amountValidation"
            type="text"
            :class="[
              'input',
              { 'edit-space': editSpace },
              { 'input-error': errors.amountValidation },
            ]"
            :readonly="!editSpace"
            placeholder="Кількість місць"
            maxlength="3"
          />
          <div class="error-text">
            {{ errors.amountValidation }}
          </div>
        </div>
      </div>
      <div class="wrapper-more-info item-center">
        <div class="more-info-property">Ціна за 1 годину</div>
        <div class="more-info-value space-inp">
          <input
            @input="onInputNumber"
            v-bind="firstPriceValidation"
            type="text"
            :class="[
              'input',
              { 'edit-space': editSpace },
              { 'input-error': errors.firstPriceValidation },
            ]"
            :readonly="!editSpace"
            placeholder="Вартість 1 години / грн"
            maxlength="3"
          />
          <div class="error-text">
            {{ errors.firstPriceValidation }}
          </div>
        </div>
      </div>
      <div class="wrapper-more-info">
        <div class="more-info-property">Про простір</div>
        <div class="more-info-value">
          <textarea
            class="mng-cow-inp"
            v-model="space.description"
            id="aboutSpace"
            name="aboutSpace"
            :readonly="!editSpace"
            rows="7"
            :class="['input', { 'edit-space': editSpace }]"
            placeholder="Опис простору"
          ></textarea>
        </div>
      </div>
      <div class="wrapper-more-info">
        <div class="more-info-property">Фото простору</div>
        <div class="more-info-value">
          <input class="" type="file" ref="spaceFoto" :disabled="!editSpace" />
        </div>
      </div>
      <div class="more-info-function">
        <div class="less-info-function">
          <div v-if="id != 0 || space.id">
            <button
              v-if="editSpace"
              @click="editCurrentSpace"
              class="save-more-info"
            >
              Зберегти
            </button>
          </div>
          <div v-else>
            <button
              v-if="editSpace"
              @click="createSpace"
              class="save-more-info"
            >
              Створити
            </button>
          </div>

          <button @click="deleteSpace" class="function">
            <img src="~assets/icon_delete.png" alt="delete" />
          </button>
          <button v-if="!editSpace" @click="editSpace = true" class="function">
            <img src="~assets/icon_edit.png" alt="edit" />
          </button>
        </div>
      </div>
    </div>
  </form>
</template>

<script setup>
import { ref } from "vue";
import { useStore } from "vuex";
import * as yup from "yup";
import { useForm } from "vee-validate";
const store = useStore();
const { $api } = useNuxtApp();
const space = ref({
  space_name: "",
  amount: "",
  description: "",
  first_price: "",
});
let showMoreInfo = ref(false);
let editSpace = ref(false);
const isRemove = ref(false);
const spaceFoto = ref(null);
const props = defineProps({
  id: {
    type: String,
    required: true,
  },
});
const coworkingId = () => {
  return store.state.manager.id;
};

const { defineInputBinds, errors, handleSubmit, setFieldValue } = useForm({
  validationSchema: yup.object({
    nameSpaceValidation: yup
      .string()
      .required("Введіть назву")
      .matches(
        /^[a-zA-Zа-яА-ЯїЇєЄіІґҐ' -\d]{2,}$/,
        "Поле заповнено некоректно",
      ),
    amountValidation: yup
      .string()
      .required("Введіть кількість місць")
      .matches(/^[\d]{1,}$/, "Поле заповнено некоректно"),
    firstPriceValidation: yup
      .string()
      .required("Введіть ціну")
      .matches(/^[\d]{1,}$/, "Поле заповнено некоректно"),
  }),
});
const nameSpaceValidation = defineInputBinds("nameSpaceValidation");
const amountValidation = defineInputBinds("amountValidation");
const firstPriceValidation = defineInputBinds("firstPriceValidation");

watchEffect(() => {
  if (props.id) {
    props.id != 0 ? getSpaceInfo(props.id) : props.id;
  }
});
const createSpace = handleSubmit(async (values) => {
  try {
    let formData = new FormData();
    formData.append("coworking_id", coworkingId());
    formData.append("space_name", values.nameSpaceValidation);
    formData.append("amount", values.amountValidation);
    formData.append("first_price", values.firstPriceValidation);
    formData.append("description", space.value.description);
    formData.append("space_photo", spaceFoto.value.files[0]);
    $api.post("/spaces", formData).then((response) => {
      getSpaceInfo(response.data[0].id);
    });
  } catch (error) {
    console.log(error);
  }
});
const editCurrentSpace = handleSubmit(async (values) => {
  try {
    let formData = new FormData();
    formData.append("id", space.value.id);
    formData.append("space_name", values.nameSpaceValidation);
    formData.append("amount", values.amountValidation);
    formData.append("first_price", values.firstPriceValidation);
    formData.append("description", space.value.description);
    spaceFoto.value.files[0]
      ? formData.append("space_photo", spaceFoto.value.files[0])
      : formData.append("space_photo", space.value.space_photo);
    $api.put("/spaces", formData).then((response) => {
      if (response.data) {
        getSpaceInfo(response.data[0].id);
        showMoreInfo.value = true;
      }
    });
  } catch (error) {
    console.log(error);
  }
});

async function getSpaceInfo(id) {
  try {
    const response = await $api.get(`/spaces?id=${id}`);
    space.value = response.data[0];
    editSpace = false;
    setFieldValue("nameSpaceValidation", response.data[0].space_name);
    setFieldValue("amountValidation", response.data[0].amount);
    setFieldValue("firstPriceValidation", response.data[0].first_price);
  } catch (error) {
    console.log(error);
  }
}

async function deleteSpace() {
  if (!space.value.id) {
    isRemove.value = true;
  } else {
    try {
      const response = await $api.delete(`/spaces?id=${space.value.id}`);
      if (response.data) {
        isRemove.value = true;
      }
    } catch (error) {
      console.log(error);
    }
  }
}

function onInput(event) {
  event.target.value = event.target.value.replace(
    /[^a-zA-Zа-яА-ЯїЇєЄіІґҐ' - \d]/g,
    "",
  );
}

function onInputNumber(event) {
  event.target.value = event.target.value.replace(/[^\d]/g, "");
}
</script>

<style>
.input-error {
  border: 1px solid red !important;
}
.coworking-spaces .space-dn {
  display: none;
}
.coworking-spaces .wrapper-space-info {
  border: 1px solid var(--text-color);
  margin-bottom: 24px;
  display: flex;
  flex-direction: row;
}

.coworking-spaces .wrapper-space-info .left-side {
  display: flex;
  flex-direction: column;
  justify-content: center;
  width: 20px;
  background-color: var(--text-color);
  padding: 0 4px;
}

.coworking-spaces .wrapper-space-info .left-side .line-space {
  width: 100%;
  height: 2px;
  margin: 2px 0;
  background-color: var(--white-color);
}

.coworking-spaces .less-info {
  width: 100%;
  padding: 16px 8px;
  display: flex;
  flex-direction: column;
}

.more-info-function .less-info-function {
  display: flex;
  flex-direction: row;
  justify-content: space-between;
}

.less-info .less-info-function {
  display: flex;
  flex-direction: row;
  justify-content: flex-end;
  margin-top: 24px;
}

.coworking-spaces .function {
  width: 46px;
  height: 46px;
  background-color: var(--text-color);
  border-radius: 6px;
  cursor: pointer;
  display: flex;
  flex-direction: row;
  align-items: center;
  justify-content: center;
  margin-left: 24px;
}

.coworking-spaces .more-info {
  width: 100%;
  padding: 32px 24px;
}

.coworking-spaces .more-info .wrapper-more-info {
  display: flex;
  flex-direction: column;
  margin-bottom: 16px;
}

.more-info .more-info-property {
  width: 100%;
  margin-bottom: 12px;
}

.more-info .more-info-value textarea,
.more-info .more-info-value input {
  width: 100%;
  padding: 5px 10px;
}

.more-info-value.space-inp {
  height: 40px;
}

.more-info-value.space-inp input {
  height: 100%;
}

.coworking-spaces .more-info-function {
  width: 100%;
  display: flex;
  flex-direction: row;
  justify-content: flex-end;
}

.coworking-spaces .save-more-info {
  width: 211px;
  height: 46px;
  background-color: var(--text-color);
  border-radius: 6px;
  color: var(--white-color);
}

.coworking-spaces .save-more-info:disabled {
  opacity: 0.6;
  cursor: not-allowed;
}

.more-info .edit-space {
  border: 1px solid #a9a9a9;
  border-radius: 6px;
}

@media (min-width: 768px) {
  .coworking-spaces .wrapper-space-info {
    margin-bottom: 32px;
  }
  .coworking-spaces .wrapper-space-info .left-side {
    width: 40px;
  }
  .coworking-spaces .less-info {
    padding: 32px 24px;
    flex-direction: row;
    justify-content: space-between;
    align-items: center;
  }

  .more-info-function .less-info-function,
  .less-info .less-info-function {
    flex-direction: row;
    justify-content: space-between;
    margin-top: 0px;
  }

  .coworking-spaces .more-info .wrapper-more-info {
    flex-direction: row;
    margin-bottom: 32px;
  }

  .wrapper-more-info.item-center {
    align-items: center;
  }

  .more-info .more-info-property {
    width: 200px;
    margin-bottom: 0;
  }

  .more-info .more-info-value textarea,
  .more-info .more-info-value input {
    width: 220px;
  }
}

@media (min-width: 900px) {
  .more-info .more-info-value textarea,
  .more-info .more-info-value input {
    width: 100%;
  }
}

@media (min-width: 1200px) {
  .more-info .more-info-value textarea,
  .more-info .more-info-value input {
    width: 400px;
  }
}
</style>
