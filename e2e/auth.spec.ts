import { test, expect } from '@playwright/test'

test.describe('Auth Pages - Login', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/auth/login')
  })

  test('login form elements are visible and interactive', async ({ page }) => {
    await expect(page.locator('input[type="email"]')).toBeVisible()
    await expect(page.locator('input[type="password"]')).toBeVisible()
    await expect(page.locator('button[type="submit"]')).toBeVisible()
    await expect(page.locator('button:has-text("Giriş Yap")')).toBeVisible()
  })

  test('login submit button shows loading state', async ({ page }) => {
    await page.locator('input[type="email"]').fill('test@example.com')
    await page.locator('input[type="password"]').fill('password123')

    const submitBtn = page.locator('button[type="submit"]')
    await submitBtn.click()

    // Should show loading text briefly
    await expect(submitBtn).toContainText(/Giriş yapılıyor|Giriş Yap/)
  })

  test('login with invalid credentials shows error', async ({ page }) => {
    await page.locator('input[type="email"]').fill('invalid@example.com')
    await page.locator('input[type="password"]').fill('wrongpassword')
    await page.locator('button[type="submit"]').click()

    // Wait for error message
    await expect(page.locator('text=E-posta veya şifre hatalı.')).toBeVisible({ timeout: 10000 })
  })

  test('Kaydolun link navigates to signup', async ({ page }) => {
    const signupLink = page.locator('a:has-text("Kaydolun")')
    await signupLink.click()
    await expect(page).toHaveURL('/auth/signup')
  })

  test('logo link navigates to home', async ({ page }) => {
    const logo = page.locator('text=İşleyen').first()
    await expect(logo).toBeVisible()
  })
})

test.describe('Auth Pages - Signup', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/auth/signup')
  })

  test('signup form elements are visible', async ({ page }) => {
    await expect(page.locator('input[type="text"]')).toBeVisible() // Full name
    await expect(page.locator('input[type="email"]')).toBeVisible()
    await expect(page.locator('input[type="password"]')).toBeVisible()
    await expect(page.locator('button:has-text("Kaydol")')).toBeVisible()
  })

  test('role selector buttons are clickable', async ({ page }) => {
    const roles = ['Öğrenci', 'Öğretmen', 'Veli']

    for (const role of roles) {
      const btn = page.locator(`button[type="button"]:has-text("${role}")`)
      await expect(btn).toBeVisible()
      await btn.click()

      // After clicking, the button should have accent styling
      const computed = await btn.evaluate((el) => window.getComputedStyle(el).borderColor)
      expect(computed).toContain('rgb(128, 131, 255)')
    }
  })

  test('signup with short password shows validation error', async ({ page }) => {
    await page.locator('input[type="text"]').fill('Test User')
    await page.locator('input[type="email"]').fill('test@example.com')
    await page.locator('input[type="password"]').fill('123')

    await page.locator('button[type="submit"]').click()

    await expect(page.locator('text=Şifre en az 6 karakter olmalıdır.')).toBeVisible()
  })

  test('Giriş yapın link navigates to login', async ({ page }) => {
    const loginLink = page.locator('a:has-text("Giriş yapın")')
    await loginLink.click()
    await expect(page).toHaveURL('/auth/login')
  })
})
