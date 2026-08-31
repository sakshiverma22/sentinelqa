import { describe, expect, it } from "vitest";
import { validateDraft } from "./qualityValidation";

describe("draft quality validation", () => {
  it("accepts a supported order contract", () => {
    expect(validateDraft({ method: "POST", path: "/orders", expectedStatus: 201, assertion: "Returns an order id", requestBody: "{\"quantity\":1}" })).toMatchObject({ valid: true, previewStatus: 201 });
  });

  it("flags unsupported routes before execution", () => {
    const result = validateDraft({ method: "GET", path: "/orders/unknown", expectedStatus: 200, assertion: "Returns an order" });
    expect(result.valid).toBe(false);
    expect(result.issues[0]).toContain("not implemented");
  });
});
