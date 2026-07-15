"use client";

import { useFrame } from "@react-three/fiber";
import { useRef } from "react";
import { AdditiveBlending, BackSide, DoubleSide } from "three";
import type { Group, Points } from "three";

import {
  solarSystemPlanets,
  type SolarSystemPlanet,
} from "@/features/game-hub/model/solar-system";

import { SolarSurfaceMaterial } from "./solar-surface-material";
import { PlanetSurfaceMaterial } from "./planet-surface-material";

type SolarSystemObjectsProps = {
  readonly isAnimationActive: boolean;
};

type OrbitalPlanetProps = {
  readonly isAnimationActive: boolean;
  readonly planet: SolarSystemPlanet;
};

const createStarPositions = () => {
  const starCount = 260;
  const positions = new Float32Array(starCount * 3);

  for (let index = 0; index < starCount; index += 1) {
    const seed = index * 12.9898;
    const radius = 8 + ((Math.sin(seed) + 1) * 0.5) * 9;
    const theta = (Math.sin(seed * 0.73) + 1) * Math.PI;
    const phi = (Math.cos(seed * 1.17) + 1) * Math.PI;
    const positionIndex = index * 3;

    positions[positionIndex] =
      radius * Math.sin(theta) * Math.cos(phi) + Math.sin(seed * 2.1);
    positions[positionIndex + 1] = radius * Math.cos(theta) * 0.65;
    positions[positionIndex + 2] =
      radius * Math.sin(theta) * Math.sin(phi) - 4;
  }

  return positions;
};

const starPositions = createStarPositions();

const OrbitalPlanet = ({
  isAnimationActive,
  planet,
}: OrbitalPlanetProps) => {
  const orbitRef = useRef<Group>(null);
  const planetRef = useRef<Group>(null);

  useFrame((_, delta) => {
    if (!isAnimationActive) {
      return;
    }

    if (orbitRef.current) {
      orbitRef.current.rotation.y += delta * planet.orbitSpeed;
    }

    if (planetRef.current) {
      planetRef.current.rotation.y += delta * planet.rotationSpeed;
    }
  });

  return (
    <>
      <mesh rotation={[Math.PI / 2 + planet.orbitTilt, 0, 0]}>
        <ringGeometry
          args={[planet.orbitRadius - 0.012, planet.orbitRadius + 0.012, 96]}
        />
        <meshBasicMaterial color="#d9e8ff" opacity={0.34} transparent />
      </mesh>
      <group rotation={[planet.orbitTilt, 0, 0]}>
        <group ref={orbitRef} rotation={[0, planet.startAngle, 0]}>
          <group ref={planetRef} position={[planet.orbitRadius, 0, 0]}>
            <mesh>
              <sphereGeometry args={[planet.radius, 28, 28]} />
              <PlanetSurfaceMaterial
                isAnimationActive={isAnimationActive}
                preset={planet.surfacePreset}
              />
            </mesh>
            {planet.atmosphere ? (
              <mesh scale={planet.atmosphere.scale}>
                <sphereGeometry args={[planet.radius, 28, 28]} />
                <meshBasicMaterial
                  color={planet.atmosphere.color}
                  depthWrite={false}
                  opacity={planet.atmosphere.opacity}
                  side={BackSide}
                  transparent
                />
              </mesh>
            ) : null}
            {planet.rings ? (
              <mesh rotation={[Math.PI / 2 + planet.rings.tilt, 0, 0]}>
                <ringGeometry
                  args={[planet.rings.innerRadius, planet.rings.outerRadius, 64]}
                />
                <meshBasicMaterial
                  color={planet.rings.color}
                  depthWrite={false}
                  opacity={planet.rings.opacity}
                  side={DoubleSide}
                  transparent
                />
              </mesh>
            ) : null}
          </group>
        </group>
      </group>
    </>
  );
};

export const SolarSystemObjects = ({
  isAnimationActive,
}: SolarSystemObjectsProps) => {
  const starsRef = useRef<Points>(null);

  useFrame((_, delta) => {
    if (!isAnimationActive) {
      return;
    }

    if (starsRef.current) {
      starsRef.current.rotation.y += delta * 0.008;
    }
  });

  return (
    <>
      <ambientLight intensity={0.7} />
      <pointLight color="#ffd166" intensity={42} position={[0, 1, 1]} />

      <points ref={starsRef}>
        <bufferGeometry>
          <bufferAttribute
            attach="attributes-position"
            args={[starPositions, 3]}
            count={starPositions.length / 3}
          />
        </bufferGeometry>
        <pointsMaterial
          color="#f7fbff"
          depthWrite={false}
          size={0.045}
          sizeAttenuation
          transparent
        />
      </points>

      <mesh>
        <sphereGeometry args={[1.1, 48, 48]} />
        <SolarSurfaceMaterial isAnimationActive={isAnimationActive} />
      </mesh>
      <mesh scale={1.36}>
        <sphereGeometry args={[1.1, 32, 32]} />
        <meshBasicMaterial
          blending={AdditiveBlending}
          color="#ff8b22"
          depthWrite={false}
          opacity={0.09}
          side={BackSide}
          transparent
        />
      </mesh>
      <mesh scale={1.62}>
        <sphereGeometry args={[1.1, 32, 32]} />
        <meshBasicMaterial
          blending={AdditiveBlending}
          color="#ff4d22"
          depthWrite={false}
          opacity={0.035}
          side={BackSide}
          transparent
        />
      </mesh>

      {solarSystemPlanets.map((planet) => (
        <OrbitalPlanet
          key={planet.orbitRadius}
          isAnimationActive={isAnimationActive}
          planet={planet}
        />
      ))}
    </>
  );
};
