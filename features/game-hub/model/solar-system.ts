export type PlanetSurfacePreset = "earth" | "gas" | "rocky" | "ringed";

type PlanetAtmosphere = {
  readonly color: string;
  readonly opacity: number;
  readonly scale: number;
};

type PlanetRings = {
  readonly color: string;
  readonly innerRadius: number;
  readonly opacity: number;
  readonly outerRadius: number;
  readonly tilt: number;
};

export type SolarSystemPlanet = {
  readonly atmosphere?: PlanetAtmosphere;
  readonly orbitRadius: number;
  readonly orbitSpeed: number;
  readonly orbitTilt: number;
  readonly radius: number;
  readonly rotationSpeed: number;
  readonly rings?: PlanetRings;
  readonly startAngle: number;
  readonly surfacePreset: PlanetSurfacePreset;
};

export const solarSystemPlanets: readonly SolarSystemPlanet[] = [
  {
    atmosphere: {
      color: "#bdeee8",
      opacity: 0.1,
      scale: 1.07,
    },
    orbitRadius: 2.1,
    orbitSpeed: 1.12,
    orbitTilt: -0.18,
    radius: 0.22,
    rotationSpeed: 1.4,
    startAngle: 0.4,
    surfacePreset: "earth",
  },
  {
    orbitRadius: 3.25,
    orbitSpeed: 0.74,
    orbitTilt: 0.12,
    radius: 0.31,
    rotationSpeed: 1.1,
    startAngle: 2.1,
    surfacePreset: "gas",
  },
  {
    orbitRadius: 4.55,
    orbitSpeed: 0.48,
    orbitTilt: -0.08,
    radius: 0.27,
    rotationSpeed: 1.8,
    startAngle: 4.3,
    surfacePreset: "rocky",
  },
  {
    orbitRadius: 6.05,
    orbitSpeed: 0.31,
    orbitTilt: 0.2,
    radius: 0.43,
    rotationSpeed: 0.86,
    rings: {
      color: "#b6b2cf",
      innerRadius: 0.62,
      opacity: 0.42,
      outerRadius: 1.02,
      tilt: 0.36,
    },
    startAngle: 5.25,
    surfacePreset: "ringed",
  },
];
