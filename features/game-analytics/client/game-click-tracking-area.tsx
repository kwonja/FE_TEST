"use client";

import type { ComponentPropsWithoutRef, MouseEvent } from "react";

import { trackGameClick } from "./track-game-click";

type GameClickTrackingAreaProps = ComponentPropsWithoutRef<"div">;

export const GameClickTrackingArea = ({
  children,
  ...props
}: GameClickTrackingAreaProps) => {
  const handleClick = (event: MouseEvent<HTMLElement>) => {
    const target = event.target;

    if (!(target instanceof HTMLElement)) {
      return;
    }

    const clickedGameElement = target.closest<HTMLElement>("[data-game-id]");

    if (!clickedGameElement) {
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
