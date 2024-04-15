import { defineNuxtRouteMiddleware, useNuxtApp, ref } from "#imports";
import { navigateTo } from "~~/your_import_path";

export default defineNuxtRouteMiddleware((to) => {
  const bus = useNuxtApp().$bus;
  let email = ref("");
  if (to.path === "/login") {
    if (to.query.email) {
      email.value = to.query.email;
      localStorage.setItem("queryEmail", email.value);
    }

    setTimeout(() => {
      navigateTo("/");
      setTimeout(() => {
        bus.$emit("Modal", {
          openModal: true,
          showLogin: true,
          showRegistration: false,
          textModalMessage: "",
          emailProps: localStorage.getItem("queryEmail"),
        });
      }, 100);
    }, 100);
  }
});
