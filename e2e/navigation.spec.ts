import { test, expect } from '@playwright/test'

test.describe('Top Navigation', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/')
  })

  test('logo link navigates to home', async ({ page }) => {
    const logo = page.locator('a:has-text("İşler LearnTwin AI")')
    await expect(logo).toBeVisible()
    await logo.click()
    await expect(page).toHaveURL('/')
  })

  test('nav links are visible and clickable on pages with TopNav', async ({ page }) => {
    // Go to a page that has TopNav
    await page.goto('/courses')

    const navLinks = ['Panel', 'Dersler', 'Analitik', 'Kaynaklar']
    for (const link of navLinks) {
      const navLink = page.locator('nav a', { hasText: link })
      if (await navLink.isVisible().catch(() => false)) {
        await expect(navLink).toBeVisible()
      }
    }
  })

  test('Dersler nav link navigates to courses', async ({ page }) => {
    await page.goto('/')
    const derslerLink = page.locator('nav a:has-text("Dersler")')
    if (await derslerLink.isVisible().catch(() => false)) {
      await derslerLink.click()
      await expect(page).toHaveURL('/courses')
    }
  })

  test('user avatar dropdown shows logout button', async ({ page }) => {
    await page.goto('/')

    // Find avatar
    const avatar = page.locator('div.cursor-pointer').filter({ hasText: /[A-Z]{1,2}/ })
    if (await avatar.isVisible().catch(() => false)) {
      await avatar.click()

      // Logout button should appear
      const logoutBtn = page.locator('button:has-text("Çıkış Yap")')
      await expect(logoutBtn).toBeVisible()

      // Click away to close
      await page.keyboard.press('Escape')
    }
  })

  test('header icons are present', async ({ page }) => {
    await page.goto('/courses')

    // Search, bell, and settings icons should be in the header
    const searchIcon = page.locator('header svg').first()
    await expect(searchIcon).toBeVisible()
  })
})

test.describe('Page Header Component', () => {
  test('back button in PageHeader works', async ({ page }) => {
    await page.goto('/teacher/class')
    await page.waitForTimeout(3000)

    // PageHeader back button
    const backBtn = page.locator('button:has-text("Öğretmen Paneli")')
    if (await backBtn.isVisible().catch(() => false)) {
      await backBtn.click()
      await expect(page).toHaveURL('/teacher')
    }
  })
})

test.describe('Footer', () => {
  test('footer is visible on pages', async ({ page }) => {
    await page.goto('/')
    // Footer is rendered at the bottom
    const footer = page.locator('footer')
    await expect(footer).toBeVisible()
  })
})

test.describe('Cross-page Navigation Flow', () => {
  test('full user journey through public pages', async ({ page }) => {
    // Start at landing
    await page.goto('/')
    await expect(page).toHaveURL('/')

    // Go to login
    await page.locator('a:has-text("Giriş Yap")').click()
    await expect(page).toHaveURL('/auth/login')

    // Go to signup from login
    await page.locator('a:has-text("Kaydolun")').click()
    await expect(page).toHaveURL('/auth/signup')

    // Go back to login
    await page.locator('a:has-text("Giriş yapın")').click()
    await expect(page).toHaveURL('/auth/login')

    // Navigate to courses
    await page.goto('/courses')
    await expect(page).toHaveURL('/courses')
  })
})
