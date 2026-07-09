"use client";

import { Check, X, XCircle } from "lucide-react";
import { cssTransition, toast, ToastContainer } from "react-toastify/unstyled";

type AppToastType = "success" | "error";

type AppToastOptions = {
  title: string;
  description: string;
};

const TOAST_THEME = {
  success: {
    icon: Check,
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
      <span className="app-toast__icon-badge" aria-hidden="true">
        <Icon className="app-toast__icon" />
      </span>
      <div className="app-toast__content">
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
    autoClose: 2800,
  });
};

const AppToastCloseButton = ({ closeToast }: { closeToast?: () => void }) => {
  return (
    <button
      type="button"
      className="app-toast__close"
      aria-label="토스트 닫기"
      onClick={closeToast}
    >
      <X className="app-toast__close-icon" aria-hidden="true" />
    </button>
  );
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
      closeButton={AppToastCloseButton}
      hideProgressBar={false}
      limit={3}
      draggable={false}
      transition={appToastTransition}
    />
  );
};
