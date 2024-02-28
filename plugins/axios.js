import axios from "axios";

// const baseURL = "https://hub-api.intita.com";
const baseURL = "http://localhost:4041";

let api, tokenAxios;

export const initialDataToken = async () => {
  tokenAxios = localStorage.getItem("access_token");
  api.defaults.headers.Authorization = `Bearer ${tokenAxios}`;
};

export const refreshToken = async () => {
  await api
    .get("/refresh")
    .then((response) => {
      localStorage.setItem("access_token", response.data.accessToken);
      localStorage.setItem("refreshToken", response.data.refreshToken);
    })
    .catch((error) => {
      console.error("Ошибка", error);
      return refreshToken();
    });
};

export default defineNuxtPlugin((nuxtApp) => {
  api = axios.create({
    baseURL,
    headers: {
      Authorization: "",
    },
  });
  api.defaults.withCredentials = true;

  api.interceptors.request.use(async (config) => {
    if (tokenAxios) {
      config.headers.Authorization = `Bearer ${tokenAxios}`;
    }
    return config;
  });

  api.interceptors.response.use(
    (response) => response,
    async (error) => {
      if (error.response.status == 401 || error.response.status == 403) {
        await refreshToken();
        initialDataToken();
        const originalRequest = error.config;
        originalRequest.headers.Authorization = `Bearer ${tokenAxios}`;
        return api(originalRequest);
      }
      return Promise.reject(error);
    }
  );

  return {
    provide: {
      api: api,
    },
  };
});
