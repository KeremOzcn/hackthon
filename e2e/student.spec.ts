import { test, expect } from '@playwright/test'

test.describe('Student Session Page', () => {
  test('redirects unauthenticated users to login', async ({ page }) => {
    await page.goto('/student/session')
    await expect(page).toHaveURL('/auth/login')
  })

  test('entering name on landing and continuing redirects to login without auth', async ({ page }) => {
    await page.goto('/')
    await page.waitForSelector('button:has-text("Devam Et")', { timeout: 15000 })
    await page.locator('input[type="text"]').fill('Test Öğrenci')
    await page.locator('.grid.gap-3 .cursor-pointer').first().click()
    await page.locator('button:has-text("Devam Et")').click()
    // Redirected to login because /student/session is protected
    await expect(page).toHaveURL('/auth/login')
  })
})

test.describe('Student Result Page', () => {
  test('tab buttons switch content when result data is present', async ({ page }) => {
    // Set a mock result in localStorage and navigate
    await page.goto('/')
    await page.evaluate(() => {
      localStorage.setItem('learntwin_result', JSON.stringify({
        twinType: 'Hızlı ama Dikkatsiz',
        dominantPattern: 'Test pattern',
        cognitiveIssue: 'Test cognitive',
        behavioralIssue: 'Test behavioral',
        riskLevel: 'medium',
        nextBestAction: 'Test action. Do this. Then that.',
        studentMessage: 'Hello student',
        teacherAction: 'Teacher action',
        parentMessage: 'Parent message',
        stats: { accuracy: 75, avgTimeSeconds: 42, hintsUsed: 2, highConfidenceWrong: 1 },
        gamification: { earnedAchievements: [] },
      }))
    })

    await page.goto('/student/result')

    // All three tabs should be visible
    const tabs = [
      'Öğrenciye Özel Geri Bildirim',
      'Öğretmen İçin Aksiyonlar',
      'Veli Raporu',
    ]

    for (const tab of tabs) {
      const tabBtn = page.locator(`button:has-text("${tab}")`)
      await expect(tabBtn).toBeVisible()
      await tabBtn.click()
      // Tab should become active (accent border)
      await expect(tabBtn).toHaveCSS('border-bottom-color', /rgb\(128, 131, 255\)/)
    }
  })

  test('navigation buttons on result page work', async ({ page }) => {
    await page.goto('/')
    await page.evaluate(() => {
      localStorage.setItem('learntwin_result', JSON.stringify({
        twinType: 'Hızlı ama Dikkatsiz',
        dominantPattern: 'Test pattern',
        cognitiveIssue: 'Test cognitive',
        behavioralIssue: 'Test behavioral',
        riskLevel: 'medium',
        nextBestAction: 'Test action',
        studentMessage: 'Hello',
        teacherAction: 'Teacher action',
        parentMessage: 'Parent message',
        stats: { accuracy: 75, avgTimeSeconds: 42, hintsUsed: 2, highConfidenceWrong: 1 },
        gamification: { earnedAchievements: [] },
      }))
    })

    await page.goto('/student/result')

    // Test Geçmişim button
    const historyBtn = page.locator('button:has-text("Geçmişim")')
    await expect(historyBtn).toBeVisible()

    // Test Rozetlerim button
    const achievementsBtn = page.locator('button:has-text("Rozetlerim")')
    await expect(achievementsBtn).toBeVisible()

    // Test Ana Sayfa button
    const homeBtn = page.locator('button:has-text("Ana Sayfa")')
    await expect(homeBtn).toBeVisible()
    await homeBtn.click()
    await expect(page).toHaveURL('/')
  })
})

test.describe('Student History Page', () => {
  test('redirects unauthenticated users to login', async ({ page }) => {
    await page.goto('/student/history')
    await expect(page).toHaveURL('/auth/login')
  })
})

test.describe('Student Achievements Page', () => {
  test('redirects unauthenticated users to login', async ({ page }) => {
    await page.goto('/student/achievements')
    await expect(page).toHaveURL('/auth/login')
  })
})
