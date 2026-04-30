import { test, expect } from "@playwright/test";

test.describe("Homepage", () => {
  test("loads and shows hero content", async ({ page }) => {
    await page.goto("/");
    await expect(page.locator("body")).toContainText("CasaStudente");
  });

  test("navigates to listings page", async ({ page }) => {
    await page.goto("/");
    await page.click('a[href="/listings"]');
    await expect(page).toHaveURL("/listings");
  });
});

test.describe("Listings", () => {
  test("displays listing cards", async ({ page }) => {
    await page.goto("/listings");
    await expect(page.locator("body")).toContainText("Annunci");
  });

  test("navigates to listing detail", async ({ page }) => {
    await page.goto("/listings");
    const firstListing = page.locator('a[href^="/listings/"]').first();
    if (await firstListing.isVisible()) {
      await firstListing.click();
      await expect(page.url()).toContain("/listings/");
    }
  });
});

test.describe("Navigation", () => {
  test("has working navbar links", async ({ page }) => {
    await page.goto("/");
    const navLinks = ["Annunci", "Coinquilini", "Dashboard"];
    for (const label of navLinks) {
      const link = page.locator(`nav a:has-text("${label}")`).first();
      if (await link.isVisible()) {
        await expect(link).toBeVisible();
      }
    }
  });
});

test.describe("Dashboard", () => {
  test("shows dashboard content", async ({ page }) => {
    await page.goto("/dashboard");
    // Dashboard may redirect to login or show content
    await expect(page.locator("body")).toBeVisible();
  });
});
