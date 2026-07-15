import {
  createSolarSurfaceUniforms,
  solarSurfaceFragmentShader,
  solarSurfaceVertexShader,
} from "@/features/game-hub/components/solar-surface-material";

import { describe, expect, it } from "vitest";

describe("solar surface material", () => {
  it("시간 uniform과 표면·흑점·fresnel shader 구성을 제공한다", () => {
    const firstUniforms = createSolarSurfaceUniforms();
    const secondUniforms = createSolarSurfaceUniforms();

    expect(firstUniforms.uTime.value).toBe(0);
    expect(firstUniforms).not.toBe(secondUniforms);
    expect(solarSurfaceFragmentShader).toContain("softSunspot");
    expect(solarSurfaceFragmentShader).toContain("fresnel");
    expect(solarSurfaceFragmentShader).toContain("uTime");
    expect(solarSurfaceVertexShader).toContain("vViewPosition");
    expect(solarSurfaceFragmentShader).toContain("normalize(-vViewPosition)");
  });
});
