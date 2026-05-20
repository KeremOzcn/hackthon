import { Page } from '@playwright/test'

export async function setDemoAuth(page: Page, role: 'teacher' | 'parent' | 'student') {
  await page.context().addCookies([
    { name: 'demo_auth', value: 'true', domain: 'localhost', path: '/' },
    { name: 'demo_role', value: role, domain: 'localhost', path: '/' },
  ])
}
