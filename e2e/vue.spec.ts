import { test, expect } from '@playwright/test'

// See here how to get started:
// https://playwright.dev/docs/intro
test('la landing se muestra y Empezar lleva al login', async ({ page }) => {
  await page.goto('/')
  await expect(page.locator('h1')).toHaveText('Comanda tu flota en el universo SpaceTraders')

  await page.getByRole('link', { name: 'Empezar' }).click()
  await expect(page).toHaveURL('/login')
})
