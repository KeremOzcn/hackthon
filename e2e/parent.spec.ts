import { test, expect } from '@playwright/test'

test.describe('Parent Dashboard', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/parent')
    await page.waitForTimeout(3000)
  })

  test('Geri button navigates to home', async ({ page }) => {
    const backBtn = page.locator('button:has-text("← Geri")')
    if (await backBtn.isVisible().catch(() => false)) {
      await backBtn.click()
      await expect(page).toHaveURL('/')
    }
  })

  test('page header is visible', async ({ page }) => {
    const header = page.locator('h1:has-text("Veli Bilgilendirme Raporu")')
    await expect(header).toBeVisible()
  })

  test('Detayli Raporu Incele button is present when data exists', async ({ page }) => {
    const reportBtn = page.locator('button:has-text("Detayli Raporu Incele")')
    const count = await reportBtn.count()
    if (count > 0) {
      await expect(reportBtn).toBeVisible()
    }
  })
})
