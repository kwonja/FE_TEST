"use client";

import { useFrame } from "@react-three/fiber";
import { useMemo, useRef } from "react";
import type { ShaderMaterial } from "three";

type SolarSurfaceMaterialProps = {
  readonly isAnimationActive: boolean;
};

export const solarSurfaceVertexShader = `
  varying vec3 vNormal;
  varying vec3 vViewPosition;
  varying vec2 vUv;

  void main() {
    vNormal = normalize(normalMatrix * normal);
    vUv = uv;
    vViewPosition = (modelViewMatrix * vec4(position, 1.0)).xyz;
    gl_Position = projectionMatrix * vec4(position, 1.0);
  }
`;

export const solarSurfaceFragmentShader = `
  uniform float uTime;

  varying vec3 vNormal;
  varying vec3 vViewPosition;
  varying vec2 vUv;

  float hash(vec3 position) {
    return fract(sin(dot(position, vec3(127.1, 311.7, 74.7))) * 43758.5453123);
  }

  float noise(vec3 position) {
    vec3 cell = floor(position);
    vec3 fraction = fract(position);
    fraction = fraction * fraction * (3.0 - 2.0 * fraction);

    return mix(
      mix(mix(hash(cell + vec3(0.0, 0.0, 0.0)), hash(cell + vec3(1.0, 0.0, 0.0)), fraction.x),
          mix(hash(cell + vec3(0.0, 1.0, 0.0)), hash(cell + vec3(1.0, 1.0, 0.0)), fraction.x), fraction.y),
      mix(mix(hash(cell + vec3(0.0, 0.0, 1.0)), hash(cell + vec3(1.0, 0.0, 1.0)), fraction.x),
          mix(hash(cell + vec3(0.0, 1.0, 1.0)), hash(cell + vec3(1.0, 1.0, 1.0)), fraction.x), fraction.y),
      fraction.z
    );
  }

  float fractalNoise(vec3 position) {
    float value = 0.0;
    float amplitude = 0.58;

    for (int octave = 0; octave < 3; octave++) {
      value += noise(position) * amplitude;
      position *= 2.1;
      amplitude *= 0.5;
    }

    return value;
  }

  float softSunspot(vec2 uv, vec2 center, float radius) {
    float distanceToSpot = length(uv - center);
    return 1.0 - smoothstep(radius * 0.45, radius, distanceToSpot);
  }

  void main() {
    vec3 viewDirection = normalize(-vViewPosition);
    float facing = max(dot(normalize(vNormal), viewDirection), 0.0);
    float fresnel = pow(1.0 - facing, 2.25);
    float surfaceNoise = fractalNoise(normalize(vViewPosition) * 3.6 + vec3(0.0, uTime * 0.055, 0.0));
    float granulation = smoothstep(0.22, 0.86, surfaceNoise);

    float sunspots = softSunspot(vUv, vec2(0.31, 0.62), 0.075);
    sunspots += softSunspot(vUv, vec2(0.66, 0.37), 0.052);
    sunspots += softSunspot(vUv, vec2(0.55, 0.72), 0.042);
    sunspots = clamp(sunspots, 0.0, 1.0);

    vec3 coreColor = vec3(1.0, 0.93, 0.68);
    vec3 surfaceColor = vec3(1.0, 0.44, 0.08);
    vec3 rimColor = vec3(0.9, 0.08, 0.025);
    vec3 color = mix(surfaceColor, coreColor, facing * 0.82 + granulation * 0.18);
    color *= 1.0 - sunspots * 0.38;
    color += rimColor * fresnel * 0.72;

    gl_FragColor = vec4(color, 1.0);
  }
`;

export const createSolarSurfaceUniforms = () => ({
  uTime: { value: 0 },
});

export const SolarSurfaceMaterial = ({
  isAnimationActive,
}: SolarSurfaceMaterialProps) => {
  const materialRef = useRef<ShaderMaterial>(null);
  const uniforms = useMemo(() => createSolarSurfaceUniforms(), []);

  useFrame((_, delta) => {
    if (!isAnimationActive || !materialRef.current) {
      return;
    }

    materialRef.current.uniforms.uTime.value += delta * 0.18;
  });

  return (
    <shaderMaterial
      ref={materialRef}
      fragmentShader={solarSurfaceFragmentShader}
      uniforms={uniforms}
      vertexShader={solarSurfaceVertexShader}
    />
  );
};
