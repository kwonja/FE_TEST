import {
  createPlanetSurfaceUniforms,
  planetSurfaceFragmentShader,
  planetSurfaceVertexShader,
} from "@/features/game-hub/components/planet-surface-material";
import { solarSystemPlanets } from "@/features/game-hub/model/solar-system";

import { describe, expect, it } from "vitest";

describe("planet surface material", () => {
  it("네 가지 행성 표면 preset에 독립적인 시간 uniform을 만든다", () => {
    const earthUniforms = createPlanetSurfaceUniforms("earth");
    const gasUniforms = createPlanetSurfaceUniforms("gas");

    expect(earthUniforms.uSurfacePreset.value).toBe(0);
    expect(gasUniforms.uSurfacePreset.value).toBe(1);
    expect(earthUniforms).not.toBe(gasUniforms);
    expect(earthUniforms.uTime.value).toBe(0);
  });

  it("지구·가스·암석·고리형 표면과 시선 공간 조명을 shader에 포함한다", () => {
    expect(planetSurfaceFragmentShader).toContain("continents");
    expect(planetSurfaceFragmentShader).toContain("storm");
    expect(planetSurfaceFragmentShader).toContain("crater");
    expect(planetSurfaceFragmentShader).toContain("uSurfacePreset");
    expect(planetSurfaceVertexShader).toContain("vViewPosition");
    expect(planetSurfaceFragmentShader).toContain("normalize(-vViewPosition)");
  });

  it("모델이 네 가지 표면과 고리형 행성 구성을 선언한다", () => {
    expect(solarSystemPlanets.map((planet) => planet.surfacePreset)).toEqual([
      "earth",
      "gas",
      "rocky",
      "ringed",
    ]);
    expect(solarSystemPlanets[0].atmosphere).toBeDefined();
    expect(solarSystemPlanets[3].rings).toMatchObject({
      innerRadius: 0.62,
      outerRadius: 1.02,
    });
  });
});
