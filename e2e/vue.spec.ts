import { test, expect } from '@playwright/test'

test('el diálogo de acceso se abre desde el header y la landing', async ({ page }) => {
  await page.goto('/')
  await expect(page.locator('h1')).toHaveText('Comanda tu flota en el universo SpaceTraders')

  const dialog = page.getByRole('dialog', { name: 'Accede a SpaceTraders' })

  await page.getByRole('button', { name: 'Iniciar sesión' }).click()
  await expect(dialog).toBeVisible()
  await expect(dialog.getByRole('tab', { name: 'Iniciar sesión' })).toHaveAttribute(
    'aria-selected',
    'true',
  )

  await dialog.getByRole('tab', { name: 'Crear cuenta' }).click()
  await expect(dialog.getByRole('tab', { name: 'Crear cuenta' })).toHaveAttribute(
    'aria-selected',
    'true',
  )
  await expect(dialog.getByLabel('Nombre')).toBeVisible()

  await page.keyboard.press('Escape')
  await expect(dialog).toBeHidden()

  await page.getByRole('button', { name: 'Empezar' }).click()
  await expect(dialog).toBeVisible()
  await expect(dialog.getByRole('tab', { name: 'Crear cuenta' })).toHaveAttribute(
    'aria-selected',
    'true',
  )
})
