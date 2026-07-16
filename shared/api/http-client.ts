import axios from "axios";

import { OfflineError } from "./http-error";

export const httpClient = axios.create({
  baseURL: "/api",
  timeout: 10_000,
});

httpClient.interceptors.request.use((config) => {
  if (typeof navigator !== "undefined" && !navigator.onLine) {
    return Promise.reject(new OfflineError());
  }

  return config;
});
