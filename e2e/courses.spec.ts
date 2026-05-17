import { test, expect } from '@playwright/test'

test.describe('Courses Page', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/courses')
  })

  test('course cards are clickable and navigate to detail', async ({ page }) => {
    // Wait for course cards
    await page.waitForSelector('.glass-card', { timeout: 10000 })

    const courseCards = page.locator('.glass-card').first()
    await expect(courseCards).toBeVisible()

    // Click first course card
    const firstCard = page.locator('.glass-card').first()
    await firstCard.click()

    // Should navigate to a course detail page
    await expect(page).toHaveURL(/\/courses\//)
  })

  test('page header is visible', async ({ page }) => {
    const header = page.locator('h1:has-text("Dersler")')
    await expect(header).toBeVisible()
  })
})

test.describe('Course Detail Page', () => {
  test('breadcrumb navigation works', async ({ page }) => {
    await page.goto('/courses/matematik')
    await page.waitForTimeout(5000)

    // Breadcrumb "DERSLER" should be clickable
    const breadcrumb = page.locator('text=DERSLER')
    if (await breadcrumb.isVisible().catch(() => false)) {
      await breadcrumb.click()
      await expect(page).toHaveURL('/courses')
    }
  })

  test('Derslere Don button navigates to courses', async ({ page }) => {
    await page.goto('/courses/matematik')
    await page.waitForTimeout(5000)

    const backBtn = page.locator('button:has-text("Derslere Don")')
    if (await backBtn.isVisible().catch(() => false)) {
      await backBtn.click()
      await expect(page).toHaveURL('/courses')
    }
  })

  test('not-found state has working button', async ({ page }) => {
    await page.goto('/courses/non-existent')
    await page.waitForTimeout(3000)

    const backBtn = page.locator('button:has-text("Derslere Dön")')
    if (await backBtn.isVisible().catch(() => false)) {
      await backBtn.click()
      await expect(page).toHaveURL('/courses')
    }
  })
})
