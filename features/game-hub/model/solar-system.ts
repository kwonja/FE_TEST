export type SolarSystemPlanet = {
  readonly color: string;
  readonly orbitRadius: number;
  readonly orbitSpeed: number;
  readonly orbitTilt: number;
  readonly radius: number;
  readonly rotationSpeed: number;
  readonly startAngle: number;
};

export const solarSystemPlanets: readonly SolarSystemPlanet[] = [
  {
    color: "#8ecae6",
    orbitRadius: 2.1,
    orbitSpeed: 1.12,
    orbitTilt: -0.18,
    radius: 0.22,
    rotationSpeed: 1.4,
    startAngle: 0.4,
  },
  {
    color: "#ffd166",
    orbitRadius: 3.25,
    orbitSpeed: 0.74,
    orbitTilt: 0.12,
    radius: 0.31,
    rotationSpeed: 1.1,
    startAngle: 2.1,
  },
  {
    color: "#ff6b6b",
    orbitRadius: 4.55,
    orbitSpeed: 0.48,
    orbitTilt: -0.08,
    radius: 0.27,
    rotationSpeed: 1.8,
    startAngle: 4.3,
  },
  {
    color: "#b8f2e6",
    orbitRadius: 6.05,
    orbitSpeed: 0.31,
    orbitTilt: 0.2,
    radius: 0.43,
    rotationSpeed: 0.86,
    startAngle: 5.25,
  },
];
