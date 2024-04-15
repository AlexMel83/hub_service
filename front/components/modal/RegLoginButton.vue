<template>
  <button type="submit">{{ textContent }}</button>
</template>
<script>
export default {
  data() {
    return {};
  },
  props: {
    textContent: String,
    required: true,
  },
};
</script>

<style scoped>
button {
  width: 100%;
  height: 46px;
  background-color: var(--white-color);
  border: none;
  border-radius: 10px;
  cursor: pointer;
  color: var(--black-color);
  font-family: Inter;
  font-size: 18px;
  font-style: normal;
  font-weight: 400;
  line-height: normal;
  margin-top: 24px;
}

@media (min-width: 768px) {
  button {
    margin-top: 12px;
    width: 306px;
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
}
</style>
