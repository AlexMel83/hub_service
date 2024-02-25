import { createStore } from "vuex";

const store = createStore({
  state() {
    return {
      isAuthed: false,
      name: "User",
    };
  },
  mutations: {
    setName(state, ob) {
      Object.assign(state, ob);
      state.isAuthed = true;
    },
  },
});

export default defineNuxtPlugin((nuxtApp) => {
  nuxtApp.vueApp.use(store);
  // Install the store instance as a plugin
});
