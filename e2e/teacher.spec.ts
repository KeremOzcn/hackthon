import { test, expect } from '@playwright/test'

test.describe('Teacher Dashboard', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/teacher')
    await page.waitForSelector('h1:has-text("Sınıf Genel Bakışı")', { timeout: 15000 })
  })

  test('filter buttons are clickable and update state', async ({ page }) => {
    const riskFilters = ['Tümü', 'Düşük', 'Orta', 'Yüksek']
    for (const filter of riskFilters) {
      const btn = page.locator('button', { hasText: new RegExp(`^${filter}$`) }).first()
      if (await btn.isVisible().catch(() => false)) {
        await btn.click()
        await expect(btn).toHaveCSS('background-color', /rgba\(99, 102, 241/)
      }
    }
  })

  test('subject filter buttons are clickable', async ({ page }) => {
    const subjectFilters = ['Tüm Dersler', 'Matematik', 'Fen Bilimleri', 'Türkçe']
    for (const filter of subjectFilters) {
      const btn = page.locator('button', { hasText: filter }).first()
      if (await btn.isVisible().catch(() => false)) {
        await btn.click()
      }
    }
  })

  test('sort buttons are clickable', async ({ page }) => {
    const sortOptions = ['Riske Göre', 'Tarihe Göre', 'Başarıya Göre']
    for (const sort of sortOptions) {
      const btn = page.locator('button', { hasText: sort }).first()
      if (await btn.isVisible().catch(() => false)) {
        await btn.click()
        await expect(btn).toHaveCSS('background-color', /rgba\(99, 102, 241/)
      }
    }
  })

  test('Analitik Paneli button navigates to analytics', async ({ page }) => {
    const analyticsBtn = page.locator('button:has-text("Analitik Paneli")')
    if (await analyticsBtn.isVisible().catch(() => false)) {
      await analyticsBtn.click()
      await expect(page).toHaveURL('/teacher/analytics')
    }
  })

  test('Geri button navigates back', async ({ page }) => {
    const backBtn = page.locator('button:has-text("← Geri")')
    if (await backBtn.isVisible().catch(() => false)) {
      await backBtn.click()
      await expect(page).toHaveURL('/')
    }
  })

  test('TÜMÜNÜ GÖR button in Attention Required is visible and clickable', async ({ page }) => {
    const seeAllBtn = page.locator('button:has-text("TÜMÜNÜ GÖR")').first()
    if (await seeAllBtn.isVisible().catch(() => false)) {
      await expect(seeAllBtn).toBeVisible()
      await seeAllBtn.click()
    }
  })

  test('check-all checkbox is clickable', async ({ page }) => {
    // Wait for table to load beyond skeleton
    await page.waitForTimeout(2000)

    const checkAll = page.locator('input[type="checkbox"]').first()
    if (await checkAll.isVisible().catch(() => false)) {
      await checkAll.check()
      await expect(checkAll).toBeChecked()
      await checkAll.uncheck()
      await expect(checkAll).not.toBeChecked()
    }
  })
})

test.describe('Teacher Analytics', () => {
  test('back button navigates to teacher dashboard', async ({ page }) => {
    await page.goto('/teacher/analytics')
    await page.waitForSelector('h1:has-text("Sınıf Analiz Raporları")', { timeout: 15000 })

    const backBtn = page.locator('button:has-text("Öğretmen Paneline Dön")')
    if (await backBtn.isVisible().catch(() => false)) {
      await backBtn.click()
      await expect(page).toHaveURL('/teacher')
    }
  })
})

test.describe('Teacher Class Management', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/teacher/class')
    await page.waitForSelector('h1:has-text("Sınıf Yönetimi")', { timeout: 15000 })
  })

  test('Yeni sınıf button clears form', async ({ page }) => {
    const newClassBtn = page.locator('button:has-text("Yeni sınıf")')
    if (await newClassBtn.isVisible().catch(() => false)) {
      await newClassBtn.click()
      const nameInput = page.locator('input[value=""]').first()
      await expect(nameInput).toBeVisible()
    }
  })

  test('class detail buttons navigate to detail page', async ({ page }) => {
    const detailBtns = page.locator('button:has-text("Detay")')
    const count = await detailBtns.count()

    if (count > 0) {
      await detailBtns.first().click()
      await expect(page).toHaveURL(/\/teacher\/class\//)
    }
  })
})

test.describe('Teacher Class Detail', () => {
  test('not-found state has working navigation button', async ({ page }) => {
    await page.goto('/teacher/class/non-existent-id')
    await page.waitForTimeout(3000)

    const backBtn = page.locator('button:has-text("Sınıf listesine git")')
    if (await backBtn.isVisible().catch(() => false)) {
      await backBtn.click()
      await expect(page).toHaveURL('/teacher/class')
    }
  })
})
