"use client";

import { useFrame } from "@react-three/fiber";
import { useMemo, useRef } from "react";
import type { ShaderMaterial } from "three";

import type { PlanetSurfacePreset } from "@/features/game-hub/model/solar-system";

type PlanetSurfaceMaterialProps = {
  readonly isAnimationActive: boolean;
  readonly preset: PlanetSurfacePreset;
};

const planetSurfacePresetValues: Record<PlanetSurfacePreset, number> = {
  earth: 0,
  gas: 1,
  rocky: 2,
  ringed: 3,
};

export const planetSurfaceVertexShader = `
  varying vec3 vNormal;
  varying vec3 vObjectPosition;
  varying vec3 vViewPosition;
  varying vec2 vUv;

  void main() {
    vNormal = normalize(normalMatrix * normal);
    vObjectPosition = position;
    vViewPosition = (modelViewMatrix * vec4(position, 1.0)).xyz;
    vUv = uv;
    gl_Position = projectionMatrix * vec4(vViewPosition, 1.0);
  }
`;

export const planetSurfaceFragmentShader = `
  uniform float uSurfacePreset;
  uniform float uTime;

  varying vec3 vNormal;
  varying vec3 vObjectPosition;
  varying vec3 vViewPosition;
  varying vec2 vUv;

  float hash(vec3 position) {
    return fract(sin(dot(position, vec3(41.3, 289.1, 113.7))) * 24634.6345);
  }

  float noise(vec3 position) {
    vec3 cell = floor(position);
    vec3 fraction = fract(position);
    fraction = fraction * fraction * (3.0 - 2.0 * fraction);

    return mix(
      mix(mix(hash(cell), hash(cell + vec3(1.0, 0.0, 0.0)), fraction.x),
          mix(hash(cell + vec3(0.0, 1.0, 0.0)), hash(cell + vec3(1.0, 1.0, 0.0)), fraction.x), fraction.y),
      mix(mix(hash(cell + vec3(0.0, 0.0, 1.0)), hash(cell + vec3(1.0, 0.0, 1.0)), fraction.x),
          mix(hash(cell + vec3(0.0, 1.0, 1.0)), hash(cell + vec3(1.0, 1.0, 1.0)), fraction.x), fraction.y),
      fraction.z
    );
  }

  float softCircle(vec2 uv, vec2 center, float radius) {
    return 1.0 - smoothstep(radius * 0.55, radius, length(uv - center));
  }

  void main() {
    vec3 normal = normalize(vNormal);
    vec3 viewDirection = normalize(-vViewPosition);
    float facing = max(dot(normal, viewDirection), 0.0);
    vec3 objectDirection = normalize(vObjectPosition);
    float surfaceNoise = noise(objectDirection * 5.2 + vec3(0.0, uTime * 0.035, 0.0));
    vec3 color;

    if (uSurfacePreset < 0.5) {
      float continents = smoothstep(0.5, 0.67, noise(objectDirection * 3.4 + vec3(0.0, 0.0, 0.4)));
      float clouds = smoothstep(0.73, 0.9, noise(objectDirection * 8.0 + vec3(uTime * 0.025, 0.0, 0.0)));
      vec3 ocean = vec3(0.05, 0.29, 0.34);
      vec3 land = vec3(0.24, 0.52, 0.42);
      color = mix(ocean, land, continents);
      color = mix(color, vec3(0.68, 0.83, 0.78), clouds * 0.16);
    } else if (uSurfacePreset < 1.5) {
      float latitude = objectDirection.y * 10.0;
      float bands = sin(latitude + surfaceNoise * 2.2 + uTime * 0.05) * 0.5 + 0.5;
      float storm = softCircle(vUv, vec2(0.62, 0.58), 0.075);
      color = mix(vec3(0.39, 0.25, 0.14), vec3(0.7, 0.59, 0.39), bands);
      color = mix(color, vec3(0.75, 0.65, 0.46), smoothstep(0.72, 0.96, bands) * 0.32);
      color *= 1.0 - storm * 0.2;
    } else if (uSurfacePreset < 2.5) {
      float crater = softCircle(vUv, vec2(0.34, 0.57), 0.12);
      crater += softCircle(vUv, vec2(0.67, 0.35), 0.075);
      color = mix(vec3(0.36, 0.16, 0.1), vec3(0.56, 0.28, 0.18), surfaceNoise);
      color *= 1.0 - clamp(crater, 0.0, 1.0) * 0.14;
    } else {
      float bands = sin(objectDirection.y * 8.0 + surfaceNoise) * 0.5 + 0.5;
      color = mix(vec3(0.25, 0.22, 0.36), vec3(0.43, 0.38, 0.53), bands * 0.7);
    }

    float rim = pow(1.0 - facing, 2.6);
    color *= 0.54 + facing * 0.46;
    color += vec3(0.16, 0.2, 0.25) * rim * 0.16;

    gl_FragColor = vec4(color, 1.0);
  }
`;

export const createPlanetSurfaceUniforms = (preset: PlanetSurfacePreset) => ({
  uSurfacePreset: { value: planetSurfacePresetValues[preset] },
  uTime: { value: 0 },
});

export const PlanetSurfaceMaterial = ({
  isAnimationActive,
  preset,
}: PlanetSurfaceMaterialProps) => {
  const materialRef = useRef<ShaderMaterial>(null);
  const uniforms = useMemo(() => createPlanetSurfaceUniforms(preset), [preset]);

  useFrame((_, delta) => {
    if (!isAnimationActive || !materialRef.current) {
      return;
    }

    materialRef.current.uniforms.uTime.value += delta * 0.08;
  });

  return (
    <shaderMaterial
      ref={materialRef}
      fragmentShader={planetSurfaceFragmentShader}
      uniforms={uniforms}
      vertexShader={planetSurfaceVertexShader}
    />
  );
};
