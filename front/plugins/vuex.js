import { createStore } from "vuex";
import { defineNuxtPlugin, useNuxtApp } from "#imports";

const store = createStore({
  state() {
    return {
      isLoading: false,
      isAuthed: false,
      userRole: "",
      authUser: {},
      activeTabAuthUserMenu: "",
      menuOpen: false,
      manager: null,
      user: null,
      allAdvantages: [],
      currentBookSpace: {
        id: "",
        price: "",
        amount: "",
      },
      social: [
        { id: 1, title: "telegram", src: "../telegram.png", link: "" },
        { id: 2, title: "viber", src: "../viber.png", link: "" },
        { id: 3, title: "instagram", src: "../instagram.png", link: "" },
        { id: 4, title: "facebook", src: "../facebook.png", link: "" },
      ],
      isMenuOpen: false,
      favoriteSpaces: [],
    };
  },
  mutations: {
    setName(state, ob) {
      Object.assign(state, ob);
      state.isAuthed = true;
    },
    setRole(state, role) {
      state.userRole = role;
      localStorage.setItem("userRole", role);
    },
    logOut(state) {
      state.authUser = {};
      state.userRole = "unknown";
    },
    getManagerData(state, data) {
      state.manager = data;
      localStorage.setItem("managerData", JSON.stringify(data));
    },
    getUserData(state, data) {
      state.authUser = data;
      localStorage.setItem("authUserData", JSON.stringify(data));
    },
    getAllAdvantages(state, data) {
      state.allAdvantages = data;
    },
    setManagerData(state, data) {
      state.manager = data;
    },
    setUserData(state, data) {
      state.authUser = data;
    },
    setAllAdvantages(state, data) {
      state.allAdvantages = data;
      localStorage.setItem("allAdvantages", JSON.stringify(data));
    },
    toggleMenu(state) {
      state.isMenuOpen = !state.isMenuOpen;
    },
    addToFavorites(state, space) {
      state.favoriteSpaces.push(space);
    },
    removeFromFavorites(state, spaceId) {
      state.favoriteSpaces = state.favoriteSpaces.filter(
        (space) => space.id !== spaceId,
      );
    },
  },
  actions: {
    async logOut({ commit }) {
      const { $api } = useNuxtApp();
      try {
        const response = await $api.post("/logout");
        if (response) {
          localStorage.clear();
          commit("logOut");
        }
      } catch (error) {
        console.log(error);
      }
    },
  },
});

export default defineNuxtPlugin((nuxtApp) => {
  nuxtApp.vueApp.use(store);
  // Install the store instance as a plugin
});
