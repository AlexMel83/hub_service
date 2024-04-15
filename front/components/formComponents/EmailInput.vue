<template>
  <div class="input-wrapper">
    <label>Email*</label>
    <div>
      <input
        v-model="value"
        @input="onInput"
        :class="['input', { error: isError }]"
        type="text"
      />
      <p>{{ textEmailError }}</p>
    </div>
  </div>
</template>
<script>
export default {
  name: "EmailInput",
  data() {
    return {
      value: "",
    };
  },
  props: {
    textEmailError: "",
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
      this.$emit("giveEmail", event.target.value);
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
