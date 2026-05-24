import { test, expect } from "@playwright/test"

test.describe("Authentication", () => {
  test("login page loads", async ({ page }) => {
    await page.goto("/login")
    await expect(page.getByRole("heading", { name: /iniciar sesión/i })).toBeVisible()
  })

  test("register page loads", async ({ page }) => {
    await page.goto("/register")
    await expect(page.getByRole("heading", { name: /crear cuenta/i })).toBeVisible()
  })

  test("login with invalid credentials shows error", async ({ page }) => {
    await page.goto("/login")
    await page.fill('input[name="email"]', "fake@example.com")
    await page.fill('input[name="password"]', "wrongpassword")
    await page.click('button[type="submit"]')
    await expect(page.getByText(/credenciales inválidas/i)).toBeVisible()
  })
})
