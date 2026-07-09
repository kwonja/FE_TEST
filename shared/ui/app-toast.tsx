"use client";

import { CheckCircle2, XCircle } from "lucide-react";
import { cssTransition, toast, ToastContainer } from "react-toastify/unstyled";

type AppToastType = "success" | "error";

type AppToastOptions = {
  title: string;
  description: string;
};

const TOAST_THEME = {
  success: {
    icon: CheckCircle2,
    className: "app-toast--success",
  },
  error: {
    icon: XCircle,
    className: "app-toast--error",
  },
} as const;

const appToastTransition = cssTransition({
  enter: "app-toast-enter",
  exit: "app-toast-exit",
  collapse: true,
  collapseDuration: 180,
});

const AppToast = ({
  type,
  title,
  description,
}: AppToastOptions & { type: AppToastType }) => {
  const Icon = TOAST_THEME[type].icon;

  return (
    <div className="app-toast">
      <Icon className="app-toast__icon" aria-hidden="true" />
      <div className="min-w-0">
        <p className="app-toast__title">{title}</p>
        <p className="app-toast__description">{description}</p>
      </div>
    </div>
  );
};

export const showAppToast = (
  type: AppToastType,
  { title, description }: AppToastOptions,
) => {
  toast(<AppToast type={type} title={title} description={description} />, {
    className: `app-toast-shell ${TOAST_THEME[type].className}`,
    bodyClassName: "app-toast-body",
    progressClassName: "app-toast-progress",
    icon: false,
    closeButton: true,
    autoClose: 2800,
  });
};

export const AppToastContainer = () => {
  return (
    <ToastContainer
      position="top-center"
      className="app-toast-container"
      newestOnTop
      closeOnClick
      pauseOnFocusLoss={false}
      pauseOnHover
      hideProgressBar={false}
      limit={3}
      draggable={false}
      transition={appToastTransition}
    />
  );
};
