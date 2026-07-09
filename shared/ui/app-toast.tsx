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
    toastClassName:
      "border-blue-500 bg-blue-50 text-game-ink shadow-[0_14px_34px_rgb(20_33_31/0.14),inset_0_1px_0_rgb(255_255_255/0.88)]",
    iconClassName: "bg-blue-500 text-white shadow-[0_0_0_4px_rgb(219_234_254)]",
    progressClassName: "bg-blue-500",
  },
  error: {
    icon: XCircle,
    toastClassName:
      "border-red-400 bg-red-50 text-game-ink shadow-[0_14px_34px_rgb(20_33_31/0.14),inset_0_1px_0_rgb(255_255_255/0.88)]",
    iconClassName: "bg-red-500 text-white shadow-[0_0_0_4px_rgb(254_226_226)]",
    progressClassName: "bg-red-500",
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
  const theme = TOAST_THEME[type];

  return (
    <div className="box-border flex min-h-19 w-full min-w-0 items-center gap-3.5 px-4 py-4 pr-12">
      <span
        className={`grid size-6.5 shrink-0 place-items-center rounded-full ${theme.iconClassName}`}
        aria-hidden="true"
      >
        <Icon className="size-4 stroke-[3]" />
      </span>
      <div className="min-w-0">
        <p className="m-0 text-sm font-black leading-tight">{title}</p>
        <p className="mt-1 mb-0 text-xs font-semibold leading-snug text-muted-foreground">
          {description}
        </p>
      </div>
    </div>
  );
};

export const showAppToast = (
  type: AppToastType,
  { title, description }: AppToastOptions,
) => {
  toast(<AppToast type={type} title={title} description={description} />, {
    className: `relative box-border min-h-19 overflow-hidden rounded-md border-[1.5px] p-0 pointer-events-auto ${TOAST_THEME[type].toastClassName}`,
    progressClassName: `app-toast-progress h-[3.5px] ${TOAST_THEME[type].progressClassName}`,
    icon: false,
    autoClose: 2800,
  });
};

const AppToastCloseButton = ({ closeToast }: { closeToast?: () => void }) => {
  return (
    <button
      type="button"
      className="absolute top-3 right-3 grid size-7 cursor-pointer place-items-center rounded-full border-0 bg-transparent p-0 text-muted-foreground opacity-100 transition-[background-color,color,transform] duration-150 ease-out hover:bg-game-ink/10 hover:text-game-ink"
      aria-label="토스트 닫기"
      onClick={closeToast}
    >
      <X className="size-4" aria-hidden="true" />
    </button>
  );
};

export const AppToastContainer = () => {
  return (
    <ToastContainer
      position="top-center"
      className="fixed top-10 left-1/2 z-[9999] grid w-[min(22.5rem,calc(100vw-2rem))] -translate-x-1/2 gap-3 p-0 pointer-events-none"
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
