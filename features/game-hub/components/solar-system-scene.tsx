"use client";

import { Canvas } from "@react-three/fiber";

import { SolarSystemObjects } from "./solar-system-objects";

type SolarSystemSceneProps = {
  readonly isAnimationActive: boolean;
};

export const SolarSystemScene = ({
  isAnimationActive,
}: SolarSystemSceneProps) => {
  return (
    <Canvas
      aria-hidden="true"
      camera={{ fov: 44, position: [0, 5.8, 14.5] }}
      dpr={[1, 1.5]}
      frameloop={isAnimationActive ? "always" : "never"}
      gl={{ alpha: true, antialias: true, powerPreference: "low-power" }}
      fallback={<div data-testid="solar-system-webgl-fallback" />}
    >
      <SolarSystemObjects isAnimationActive={isAnimationActive} />
    </Canvas>
  );
};
