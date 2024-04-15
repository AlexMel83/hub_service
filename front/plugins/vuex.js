import { createStore } from "vuex";
import { useNuxtApp } from "#imports";

const store = createStore({
  state() {
    return {
      isAuthed: false,
      userRole: "",
      authUser: {},
      activeTabAuthUserMenu: "",
      manager: null,
      user: null,
      allAdvantages: [],
      currentBookSpace: {
        id: "",
        price: "",
      },
      social: [
        { id: 1, title: "telegram", src: "../telegram.png", link: "" },
        { id: 2, title: "viber", src: "../viber.png", link: "" },
        {
          id: 3,
          title: "instagram",
          src: "../instagram.png",
          link: "",
        },
        { id: 4, title: "facebook", src: "../facebook.png", link: "" },
      ],

      isMenuOpen: false,
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
      const { $api } = useNuxtApp();
      try {
        $api.post("/logout").then((response) => {
          if (response.data) {
            localStorage.clear();
            state.authUser = {};
            state.userRole = "unknown";
          }
        });
      } catch (error) {
        console.log(error);
      }
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
  },
});

export default defineNuxtPlugin((nuxtApp) => {
  nuxtApp.vueApp.use(store);
  // Install the store instance as a plugin
});
