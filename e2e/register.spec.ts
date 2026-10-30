import { test, expect } from '@playwright/test'
import type { Locator, Page } from '@playwright/test'

async function openRegisterForm(page: Page): Promise<Locator> {
  await page.goto('/')
  await page.getByRole('button', { name: 'Empezar' }).click()
  return page.getByRole('dialog', { name: 'Accede a SpaceTraders' })
}

// Values that pass the client rules, so the request reaches the back.
async function fillAndSubmit(dialog: Locator) {
  await dialog.getByLabel('Nombre').fill('Ellen Ripley')
  await dialog.getByLabel('Email').fill('ripley@nostromo.test')
  await dialog.getByLabel('Contraseña', { exact: true }).fill('secret123')
  await dialog.getByLabel('Confirmar contraseña').fill('secret123')
  await dialog.getByLabel('Token de cuenta').fill('token-abc')
  await dialog.getByRole('button', { name: 'Crear cuenta' }).click()
}

test('tras registrarse se pide revisar el correo, y al reabrir el formulario está vacío', async ({
  page,
}) => {
  await page.route('**/auth/register', (route) =>
    route.fulfill({
      status: 201,
      json: { data: { id: 1, name: 'Ellen Ripley', email: 'ripley@nostromo.test' } },
    }),
  )

  const dialog = await openRegisterForm(page)
  await fillAndSubmit(dialog)

  await expect(dialog.getByRole('heading', { name: 'Revisa tu correo' })).toBeVisible()
  await expect(dialog).toContainText('ripley@nostromo.test')

  await page.keyboard.press('Escape')
  await expect(dialog).toBeHidden()

  await page.getByRole('button', { name: 'Empezar' }).click()
  await expect(dialog.getByLabel('Nombre')).toHaveValue('')
})

test('un 422 pide los mensajes en español y muestra cada uno junto a su campo', async ({
  page,
}) => {
  let acceptLanguage: string | undefined
  await page.route('**/auth/register', (route) => {
    acceptLanguage = route.request().headers()['accept-language']
    return route.fulfill({
      status: 422,
      json: {
        error: {
          code: 'validation_failed',
          message: 'Validation failed.',
          violations: {
            name: ['Este valor no debería estar vacío.'],
            email: ['Este valor no es una dirección de email válida.'],
            password: ['Este valor es demasiado corto. Debería tener 8 caracteres o más.'],
            accountToken: ['Este valor no debería estar vacío.'],
          },
        },
      },
    })
  })

  const dialog = await openRegisterForm(page)
  await fillAndSubmit(dialog)

  await expect(dialog.getByLabel('Nombre')).toHaveAccessibleDescription(
    'Este valor no debería estar vacío.',
  )
  await expect(dialog.getByLabel('Email')).toHaveAccessibleDescription(
    'Este valor no es una dirección de email válida.',
  )
  await expect(dialog.getByLabel('Contraseña', { exact: true })).toHaveAccessibleDescription(
    'Este valor es demasiado corto. Debería tener 8 caracteres o más.',
  )
  await expect(dialog.getByLabel('Token de cuenta')).toHaveAccessibleDescription(
    'Este valor no debería estar vacío.',
  )
  expect(acceptLanguage).toBe('es')
})

test('un 409 marca el email como ya registrado', async ({ page }) => {
  await page.route('**/auth/register', (route) =>
    route.fulfill({
      status: 409,
      json: {
        error: {
          code: 'email_already_registered',
          message: 'This email is already registered.',
        },
      },
    }),
  )

  const dialog = await openRegisterForm(page)
  await fillAndSubmit(dialog)

  await expect(dialog.getByLabel('Email')).toHaveAccessibleDescription(
    'Ya existe una cuenta registrada con ese email.',
  )
})

test('un 500 muestra el mensaje genérico de error del servidor', async ({ page }) => {
  await page.route('**/auth/register', (route) =>
    route.fulfill({
      status: 500,
      json: {
        error: {
          code: 'internal_error',
          message: 'An unexpected error occurred.',
        },
      },
    }),
  )

  const dialog = await openRegisterForm(page)
  await fillAndSubmit(dialog)

  await expect(dialog.getByRole('alert')).toHaveText(
    'Se ha producido un error en el servidor. Inténtalo de nuevo más tarde.',
  )
})

test('sin conexión con el servidor muestra el mensaje de conexión', async ({ page }) => {
  await page.route('**/auth/register', (route) => route.abort())

  const dialog = await openRegisterForm(page)
  await fillAndSubmit(dialog)

  await expect(dialog.getByRole('alert')).toHaveText(
    'No se ha podido conectar con el servidor. Comprueba tu conexión e inténtalo de nuevo.',
  )
})
