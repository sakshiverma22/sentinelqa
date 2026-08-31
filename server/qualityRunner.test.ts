import { describe, expect, it } from "vitest";
import { evaluateStep } from "./qualityRunner";

const baseStep = {
  id: 1,
  scenarioId: 1,
  position: 0,
  name: "Cancel dispatched order",
  method: "POST" as const,
  path: "/orders/cancel-dispatched",
  expectedStatus: 409,
  requestBody: null,
  assertion: "A dispatched order cannot be cancelled",
};

describe("quality runner", () => {
  it("passes when the observed domain status matches the expected status", () => {
    expect(evaluateStep(baseStep)).toMatchObject({ passed: true, actualStatus: 409, severity: "info" });
  });

  it("keeps a useful finding when an assertion expects the wrong status", () => {
    const result = evaluateStep({ ...baseStep, expectedStatus: 200 });
    expect(result).toMatchObject({ passed: false, actualStatus: 409, severity: "critical" });
    expect(result.recommendation).toContain("HTTP 200");
  });

  it("blocks routes that are not implemented by the order domain", () => {
    const result = evaluateStep({ ...baseStep, path: "/orders/not-supported" });
    expect(result).toMatchObject({ blocked: true, passed: false, actualStatus: 404, severity: "warning" });
  });
});
