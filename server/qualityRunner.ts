import type { TestStep } from "../drizzle/schema";
import { executeOrderRequest } from "./orderDomain";

export function evaluateStep(step: TestStep) {
  const response = executeOrderRequest(step.method, step.path, step.requestBody);
  const supported = response.status !== 404;
  const passed = supported && response.status === step.expectedStatus;
  const blocked = !supported;
  const actual = `HTTP ${response.status} · ${JSON.stringify(response.body)}`;

  return {
    passed,
    blocked,
    actualStatus: response.status,
    actual,
    severity: blocked ? "warning" as const : passed ? "info" as const : "critical" as const,
    title: blocked ? `${step.name} was blocked` : passed ? `${step.name} passed` : `${step.name} returned an unexpected status`,
    expected: `HTTP ${step.expectedStatus} · ${step.assertion}`,
    recommendation: blocked ? "Add a supported order-domain route before executing this step." : passed ? "No action required." : `Update the handler or assertion so this case intentionally returns HTTP ${step.expectedStatus}.`,
  };
}
