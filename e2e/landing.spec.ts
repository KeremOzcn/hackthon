import { test, expect } from '@playwright/test'

test.describe('Landing Page Buttons', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/')
    await page.waitForSelector('button:has-text("Devam Et")', { timeout: 15000 })
  })

  test('role cards are clickable and update selection state', async ({ page }) => {
    const roles = ['Öğrenci', 'Öğretmen', 'Veli']

    for (const role of roles) {
      const card = page.locator('.grid').first().locator('.glass-card', { hasText: role })
      await expect(card).toBeVisible()
      await card.click()
      await expect(card).toHaveCSS('border-color', /rgb\(128, 131, 255\)/)
    }
  })

  test('subject selector cards are clickable', async ({ page }) => {
    await page.waitForSelector('.grid.gap-3 .cursor-pointer', { timeout: 10000 })

    const subjectCards = page.locator('.grid.gap-3 .cursor-pointer')
    const count = await subjectCards.count()
    expect(count).toBeGreaterThan(0)

    const firstCard = subjectCards.first()
    await firstCard.click()
    await expect(firstCard).toHaveCSS('border-color', /rgb\(128, 131, 255\)/)
  })

  test('Devam Et button is disabled without student name for student role, enabled after', async ({ page }) => {
    const studentCard = page.locator('.grid').first().locator('.glass-card', { hasText: 'Öğrenci' })
    await studentCard.click()

    const continueBtn = page.locator('button:has-text("Devam Et")')
    await expect(continueBtn).toBeVisible()
    await expect(continueBtn).toHaveAttribute('disabled', '')

    await page.locator('input[type="text"]').fill('Test Öğrenci')
    await expect(continueBtn).not.toHaveAttribute('disabled', '')
  })

  test('teacher role Devam Et navigates to teacher page', async ({ page }) => {
    const teacherCard = page.locator('.grid').first().locator('.glass-card', { hasText: 'Öğretmen' })
    await teacherCard.click()

    const continueBtn = page.locator('button:has-text("Devam Et")')
    await continueBtn.click()
    // Page may redirect to login or load teacher page depending on auth state
    await expect(page).toHaveURL(/\/teacher|auth\/login/)
  })

  test('parent role Devam Et navigates to parent page', async ({ page }) => {
    const parentCard = page.locator('.grid').first().locator('.glass-card', { hasText: 'Veli' })
    await parentCard.click()

    const continueBtn = page.locator('button:has-text("Devam Et")')
    await continueBtn.click()
    await expect(page).toHaveURL(/\/parent|auth\/login/)
  })

  test('Giriş Yap link navigates to login', async ({ page }) => {
    const loginLink = page.locator('a:has-text("Giriş Yap")')
    await expect(loginLink).toBeVisible()
    await loginLink.click()
    await expect(page).toHaveURL('/auth/login')
  })

  test('Kaydol link navigates to signup', async ({ page }) => {
    const signupLink = page.locator('a:has-text("Kaydol")')
    await expect(signupLink).toBeVisible()
    await signupLink.click()
    await expect(page).toHaveURL('/auth/signup')
  })

  test('student name input accepts text and Enter key submits', async ({ page }) => {
    await page.locator('input[type="text"]').fill('Test User')
    await page.locator('input[type="text"]').press('Enter')
    await expect(page).toHaveURL(/\/student\/session|auth\/login/)
  })
})
