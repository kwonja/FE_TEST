"use client";

import { useEffect } from "react";

import { registerServiceWorker } from "@/shared/lib/service-worker";

export const ServiceWorkerRegister = () => {
  useEffect(() => {
    void registerServiceWorker();
  }, []);

  return null;
};
