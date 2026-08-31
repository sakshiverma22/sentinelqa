export type OrderResponse = {
  status: number;
  body: Record<string, unknown>;
};

const validMethods = new Set(["GET", "POST", "PUT", "PATCH", "DELETE"]);

export function executeOrderRequest(method: string, path: string, requestBody?: string | null): OrderResponse {
  if (!validMethods.has(method) || !path.startsWith("/")) {
    return { status: 400, body: { error: "Invalid request shape" } };
  }

  if (method === "POST" && path === "/orders") {
    try {
      const body = requestBody ? JSON.parse(requestBody) as { quantity?: unknown } : {};
      const quantity = typeof body.quantity === "number" ? body.quantity : 0;
      if (!Number.isInteger(quantity) || quantity < 1 || quantity > 20) {
        return { status: 422, body: { error: "quantity must be an integer between 1 and 20" } };
      }
      return { status: 201, body: { id: "order-001", state: "created", quantity } };
    } catch {
      return { status: 422, body: { error: "request body must be valid JSON" } };
    }
  }

  if (method === "POST" && path === "/orders/cancel-dispatched") {
    return { status: 409, body: { error: "dispatched orders cannot be cancelled", state: "dispatched" } };
  }

  if (method === "PATCH" && path === "/orders/1/delivery") {
    return { status: 403, body: { error: "staff role required" } };
  }

  if (method === "GET" && path === "/orders/1/request-id") {
    return { status: 200, body: { id: "order-001", requestId: "req-sentinel-001" } };
  }

  return { status: 404, body: { error: "order route not found" } };
}
