import { test, expect } from '@playwright/test'

test('tras registrarse se pide revisar el correo, y al reabrir el formulario está vacío', async ({
  page,
}) => {
  await page.route('**/auth/register', (route) =>
    route.fulfill({
      status: 201,
      json: { data: { id: 1, name: 'Ellen Ripley', email: 'ripley@nostromo.test' } },
    }),
  )

  await page.goto('/')
  await page.getByRole('button', { name: 'Empezar' }).click()

  const dialog = page.getByRole('dialog', { name: 'Accede a SpaceTraders' })
  await dialog.getByLabel('Nombre').fill('Ellen Ripley')
  await dialog.getByLabel('Email').fill('ripley@nostromo.test')
  await dialog.getByLabel('Contraseña', { exact: true }).fill('secret123')
  await dialog.getByLabel('Confirmar contraseña').fill('secret123')
  await dialog.getByLabel('Token de cuenta').fill('token-abc')
  await dialog.getByRole('button', { name: 'Crear cuenta' }).click()

  await expect(dialog.getByRole('heading', { name: 'Revisa tu correo' })).toBeVisible()
  await expect(dialog).toContainText('ripley@nostromo.test')

  await page.keyboard.press('Escape')
  await expect(dialog).toBeHidden()

  await page.getByRole('button', { name: 'Empezar' }).click()
  await expect(dialog.getByLabel('Nombre')).toHaveValue('')
})
