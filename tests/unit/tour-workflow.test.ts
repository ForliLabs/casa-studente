import { describe, expect, it } from "vitest";
import type { TourBooking } from "@/lib/stores/tours";
import {
  canCancelTour,
  canCompleteTour,
  canConfirmTour,
  canRequestTour,
  validateTourDateTime,
} from "@/lib/tour-workflow";

const booking: TourBooking = {
  id: "tour-1",
  listingId: "listing-1",
  listingTitle: "Via Roma",
  studentId: "student-1",
  studentName: "Student",
  landlordId: "landlord-1",
  landlordName: "Landlord",
  type: "virtual",
  status: "confirmed",
  requestedDate: "2099-01-10",
  requestedTime: "10:00",
  confirmedDate: "2099-01-11",
  confirmedTime: "11:00",
  createdAt: new Date().toISOString(),
  updatedAt: new Date().toISOString(),
};

describe("tour workflow helpers", () => {
  it("rejects past tour slots", () => {
    expect(validateTourDateTime("2000-01-01", "09:00")).toBeTruthy();
  });

  it("allows students to request tours for other landlords", () => {
    expect(canRequestTour({ id: "student-1", role: "student", email: "student@example.com" }, "landlord-1", "landlord@example.com")).toBe(true);
    expect(canRequestTour({ id: "landlord-1", role: "landlord", email: "landlord@example.com" }, "landlord-1", "landlord@example.com")).toBe(false);
  });

  it("only lets landlord confirm a requested tour", () => {
    const requestedBooking = { ...booking, status: "requested" as const };
    expect(canConfirmTour(requestedBooking, { id: "landlord-1", role: "landlord" })).toBe(true);
    expect(canConfirmTour(requestedBooking, { id: "student-1", role: "student" })).toBe(false);
  });

  it("lets participants complete or cancel confirmed tours", () => {
    expect(canCompleteTour(booking, { id: "student-1", role: "student" })).toBe(true);
    expect(canCancelTour(booking, { id: "landlord-1", role: "landlord" })).toBe(true);
  });
});
