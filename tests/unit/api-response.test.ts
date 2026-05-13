import { describe, expect, it } from "vitest";
import { apiError, apiSuccess } from "@/lib/api-response";

describe("api response helpers", () => {
  it("wraps successful payloads with metadata", async () => {
    const response = apiSuccess([{ id: 1 }], { meta: { actorRole: "admin" } });
    const body = await response.json();

    expect(response.status).toBe(200);
    expect(body.success).toBe(true);
    expect(body.data).toEqual([{ id: 1 }]);
    expect(body.meta.count).toBe(1);
    expect(body.meta.actorRole).toBe("admin");
  });

  it("wraps errors consistently", async () => {
    const response = apiError("Unauthorized", { status: 401 });
    const body = await response.json();

    expect(response.status).toBe(401);
    expect(body.success).toBe(false);
    expect(body.error.message).toBe("Unauthorized");
  });
});
