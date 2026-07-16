import { OfflineError } from "./http-error";

export const isOnline = () =>
  typeof navigator === "undefined" || navigator.onLine;

export const assertOnline = (message?: string) => {
  if (!isOnline()) {
    throw new OfflineError(message);
  }
};
