<template>
  <div class="review-container" v-if="authUser().role === 'user'">
    <h2 class="white-text">Залишити відгук</h2>
    <v-container>
      <v-card-text>
        <v-form @submit.prevent="submit">
          <div class="rating-box">
            <p class="white-text">Ваша оцінка</p>
            <v-rating
              v-model="rating.value.value"
              length="5"
              color="#AF3800"
              background-color="white"
              active-color="#AF3800"
              large
              :error-messages="rating.errorMessage.value"
            ></v-rating>
            <span v-if="rating.errorMessage.value" сlass="error">{{
              rating.errorMessage.value
            }}</span>
          </div>
          <v-text-field
            v-if="!authUser().name"
            v-model="name.value.value"
            label="Ім'я"
            variant="solo"
            dense
            :error-messages="name.errorMessage.value"
          ></v-text-field>
          <v-textarea
            v-model="text.value.value"
            label="Текст відгуку"
            variant="solo"
            dense
            :error-messages="text.errorMessage.value"
          ></v-textarea>
          <v-btn type="submit">Залишити відгук</v-btn>
        </v-form>
      </v-card-text>
    </v-container>
  </div>
</template>

<script setup>
import { ref } from "vue";
import { useStore } from "vuex";
import { useForm, useField } from "vee-validate";

const store = useStore();
const authUser = () => {
  return store.state.authUser;
};

const { handleSubmit, handleReset } = useForm({
  validationSchema: {
    rating(value) {
      if (value > 0) return true;

      return "Оцінка не повинна бути пустою.";
    },
    name(value) {
      if (authUser().name || value?.length >= 2) return true;

      return "Ім'я не повинно бути менше 2-х символів.";
    },
    text(value) {
      if (value?.length >= 5) return true;

      return "Текст відгуку не повинен бути менше 5-ти символів.";
    },
  },
});

const rating = useField("rating");
const name = useField("name");
const text = useField("text");

const submit = handleSubmit(({ rating, name, text }) => {
  const nameValue = authUser().name ? authUser().name : name;
  const reviewData = {
    rating,
    name: nameValue,
    text,
  };
  alert(JSON.stringify(reviewData, null, 2));
  handleReset();
});
</script>

<style scoped>
.review-container {
  background-color: var(--header-bg);
}

.review-container h2 {
  font-size: 32px;
  margin-top: 20px;
}

.rating-box {
  display: flex;
  align-items: center;
  gap: 20px;
  margin-bottom: 20px;
}

.rating-box p {
  font-size: 20px;
}

.white-text {
  color: white;
}

.v-container {
  max-width: 1200px;
  margin: auto;
}

.v-form {
  display: flex;
  flex-direction: column;
  gap: 20px;
}

.v-btn.v-btn--density-default {
  padding: 8px 12px;
  background-color: var(--btn-hover);
  color: var(--white-color);
  letter-spacing: normal;
  font-size: 18px;
  font-weight: 400;
  height: 38px;
  border-radius: 4px;
  align-self: flex-end;
}

.rating-box span {
  color: #b00020;
  font-size: 12px;
}
</style>
