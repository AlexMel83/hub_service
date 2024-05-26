import { useStore } from "vuex";
import { defineNuxtRouteMiddleware, navigateTo } from "#imports";
import { watch } from "vue";

export default defineNuxtRouteMiddleware((to) => {
  const store = useStore();

  watch(
    () => store.state.userRole,
    (newRole) => {
      if (newRole !== "manager" && to.path === "/manager") {
        return navigateTo("/");
      } else if (newRole !== "user" && to.path === "/user") {
        return navigateTo("/");
      } else if (newRole !== "admin" && to.path === "/admin") {
        return navigateTo("/");
      } else if (
        newRole === "unknown" &&
        ["/manager", "/user", "/admin"].includes(to.path)
      ) {
        return navigateTo("/");
      }
    },
    { immediate: true },
  );
});
