"use client";

import type { ComponentPropsWithoutRef, MouseEvent } from "react";

import { trackGameClick } from "./track-game-click";

type GameClickTrackingAreaProps = ComponentPropsWithoutRef<"div">;

export const GameClickTrackingArea = ({
  children,
  onClick,
  ...props
}: GameClickTrackingAreaProps) => {
  const handleClick = (event: MouseEvent<HTMLDivElement>) => {
    onClick?.(event);

    if (event.defaultPrevented) {
      return;
    }

    const target = event.target;

    if (!(target instanceof HTMLElement)) {
      return;
    }

    const clickedGameElement = target.closest<HTMLElement>("[data-game-id]");

    if (!clickedGameElement) {
      return;
    }

    if (!event.currentTarget.contains(clickedGameElement)) {
      return;
    }

    const { gameId, gameName } = clickedGameElement.dataset;

    if (!gameId || !gameName) {
      return;
    }

    trackGameClick({
      gameId,
      gameName,
      sourcePath: window.location.pathname,
    });
  };

  return <div {...props} onClick={handleClick}>{children}</div>;
};
