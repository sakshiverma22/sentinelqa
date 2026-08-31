import { executeOrderRequest } from "./orderDomain";

export type DraftQualityResult = {
  valid: boolean;
  issues: string[];
  previewStatus: number;
};

export function validateDraft(input: { method: string; path: string; expectedStatus: number; assertion: string; requestBody?: string | null }): DraftQualityResult {
  const issues: string[] = [];
  if (!input.assertion.trim()) issues.push("Add an observable assertion.");
  if (!input.path.startsWith("/")) issues.push("Use an absolute order-domain path.");
  if (input.expectedStatus < 100 || input.expectedStatus > 599) issues.push("Expected status must be between 100 and 599.");
  const response = executeOrderRequest(input.method, input.path, input.requestBody);
  if (response.status === 404) issues.push("This route is not implemented by the order domain and will be blocked.");
  return { valid: issues.length === 0, issues, previewStatus: response.status };
}
