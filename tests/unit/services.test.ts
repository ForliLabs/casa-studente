import { describe, it, expect } from "vitest";
import { isEmailConfigured } from "@/lib/services/email";
import { isStripeConfigured } from "@/lib/services/stripe";
import { isAIConfigured } from "@/lib/services/ai";
import {
  isMonitoringConfigured,
  getMonitoringStatus,
} from "@/lib/services/monitoring";
import { isBlobConfigured } from "@/lib/services/storage";

describe("Service Availability — Test Environment", () => {
  it("email is not configured in test env", () => {
    expect(isEmailConfigured()).toBe(false);
  });

  it("stripe is not configured in test env", () => {
    expect(isStripeConfigured()).toBe(false);
  });

  it("AI is not configured in test env", () => {
    expect(isAIConfigured()).toBe(false);
  });

  it("monitoring is not configured in test env", () => {
    expect(isMonitoringConfigured()).toBe(false);
  });

  it("blob storage is not configured in test env", () => {
    expect(isBlobConfigured()).toBe(false);
  });

  it("returns complete monitoring status", () => {
    const status = getMonitoringStatus();
    expect(status).toEqual({
      sentry: false,
      posthog: false,
      environment: "test",
    });
  });
});
