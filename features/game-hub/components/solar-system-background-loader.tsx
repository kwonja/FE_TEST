"use client";

import dynamic from "next/dynamic";
import { useEffect, useRef, useState } from "react";

const SolarSystemScene = dynamic(
  () =>
    import("./solar-system-scene").then(
      (module) => module.SolarSystemScene,
    ),
  { ssr: false },
);

export const SolarSystemBackgroundLoader = () => {
  const containerRef = useRef<HTMLDivElement>(null);
  const [isInView, setIsInView] = useState(true);
  const [isPageVisible, setIsPageVisible] = useState(true);
  const [prefersReducedMotion, setPrefersReducedMotion] = useState(false);

  useEffect(() => {
    if (typeof window.matchMedia !== "function") {
      return;
    }

    const mediaQuery = window.matchMedia("(prefers-reduced-motion: reduce)");
    const updateMotionPreference = () => {
      setPrefersReducedMotion(mediaQuery.matches);
    };

    updateMotionPreference();
    mediaQuery.addEventListener("change", updateMotionPreference);

    return () => {
      mediaQuery.removeEventListener("change", updateMotionPreference);
    };
  }, []);

  useEffect(() => {
    const updatePageVisibility = () => {
      setIsPageVisible(!document.hidden);
    };

    updatePageVisibility();
    document.addEventListener("visibilitychange", updatePageVisibility);

    return () => {
      document.removeEventListener("visibilitychange", updatePageVisibility);
    };
  }, []);

  useEffect(() => {
    const container = containerRef.current;

    if (!container || !("IntersectionObserver" in window)) {
      return;
    }

    const observer = new IntersectionObserver(([entry]) => {
      setIsInView(entry.isIntersecting);
    });

    observer.observe(container);

    return () => {
      observer.disconnect();
    };
  }, []);

  return (
    <div
      ref={containerRef}
      aria-hidden="true"
      data-testid="solar-system-background"
      className="pointer-events-none absolute inset-0 overflow-hidden bg-[radial-gradient(circle_at_35%_50%,#3a225f_0%,#171b3f_38%,#0b1024_76%)]"
    >
      {prefersReducedMotion ? (
        <div
          data-testid="solar-system-static-fallback"
          className="absolute inset-0 bg-[radial-gradient(circle_at_34%_52%,rgba(255,209,102,0.42)_0%,transparent_14%),radial-gradient(circle_at_70%_28%,rgba(142,202,230,0.34)_0%,transparent_10%)]"
        />
      ) : (
        <SolarSystemScene isAnimationActive={isInView && isPageVisible} />
      )}
    </div>
  );
};
