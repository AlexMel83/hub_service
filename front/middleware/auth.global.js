import { useStore } from "vuex";
import { defineNuxtRouteMiddleware, watchEffect, navigateTo } from "#imports";

export default defineNuxtRouteMiddleware((to) => {
  const store = useStore();

  watchEffect(() => {
    if (store.state.userRole != "manager" && to.path === "/manager") {
      return navigateTo("/");
    } else if (store.state.userRole != "user" && to.path === "/user") {
      return navigateTo("/");
    } else if (store.state.userRole != "admin" && to.path === "/admin") {
      return navigateTo("/");
    } else if (store.state.userRole == "unknown" && to.path === "/manager") {
      return navigateTo("/");
    } else if (store.state.userRole == "unknown" && to.path === "/user") {
      return navigateTo("/");
    } else if (store.state.userRole == "unknown" && to.path === "/admin") {
      return navigateTo("/");
    }
  });
});
