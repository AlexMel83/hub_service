<template>
  <div class="input-wrapper">
    <label>Ім'я*</label>
    <div>
      <input
        @input="onInput"
        v-model="value"
        :class="['input', { error: isError }]"
        type="text"
        maxlength="30"
      />
      <p>{{ textNameError }}</p>
    </div>
  </div>
</template>
<script>
export default {
  name: "NameInput",
  data() {
    return {
      value: "",
    };
  },
  props: {
    textNameError: "",
    isError: {
      default: false,
      type: Boolean,
    },
    clearForm: {
      default: false,
      type: Boolean,
    },
  },
  methods: {
    onInput(event) {
      this.value = event.target.value.replace(/[^a-zA-Zа-яА-ЯїЇєЄіІґҐ'-]/g, "");

      this.$emit("giveName", this.value);
    },
    clearForm() {
      this.value = "";
    },
  },
  watch: {
    clearForm: "clearForm",
  },
};
</script>
<style>
.error {
  border: 1px solid red !important;
}
</style>
