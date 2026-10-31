import { test, expect } from '@playwright/test'
import type { Page, Request } from '@playwright/test'

// A signed query with characters that re-encoding would change.
const search = '?id=1&expires=1700000000&token=a%2Fb+c&signature=d4e5'

// By pathname: a glob with '?' is ambiguous for a URL with a query.
async function routeConfirmEmail(page: Page): Promise<Request[]> {
  const requests: Request[] = []
  await page.route(
    (url) => url.pathname.endsWith('/auth/confirm-email'),
    (route) => {
      requests.push(route.request())
      return route.fulfill({ status: 200, json: { data: { confirmed: true } } })
    },
  )
  return requests
}

test('el enlace confirma la cuenta con el query intacto y recargar no lo repite', async ({
  page,
}) => {
  const requests = await routeConfirmEmail(page)

  await page.goto(`/confirm-email${search}`)

  const dialog = page.getByRole('dialog', { name: 'Confirmar email' })
  await expect(dialog).toContainText('Cuenta confirmada')
  await expect(page).toHaveURL('/')

  expect(requests).toHaveLength(1)
  const [request] = requests
  expect(request?.method()).toBe('POST')
  expect(request?.postData()).toBeNull()
  expect((await request?.allHeaders())?.['content-type']).toBeUndefined()
  expect(request && new URL(request.url()).search).toBe(search)

  await page.reload()
  await expect(page.getByText('Comanda tu flota')).toBeVisible()
  await expect(page.getByRole('dialog')).toHaveCount(0)
  expect(requests).toHaveLength(1)
})

test('Escape no cierra mientras confirma, y sí cuando termina', async ({ page }) => {
  let respond: () => void = () => {}
  const responded = new Promise<void>((resolve) => {
    respond = resolve
  })
  await page.route(
    (url) => url.pathname.endsWith('/auth/confirm-email'),
    async (route) => {
      await responded
      await route.fulfill({ status: 200, json: { data: { confirmed: true } } })
    },
  )

  await page.goto(`/confirm-email${search}`)
  const dialog = page.getByRole('dialog', { name: 'Confirmar email' })
  await expect(dialog).toContainText('Confirmando…')
  await page.keyboard.press('Escape')
  await expect(dialog).toContainText('Confirmando…')

  respond()
  await expect(dialog).toContainText('Cuenta confirmada')
  await page.keyboard.press('Escape')
  await expect(dialog).toBeHidden()
})

test('Iniciar sesión cierra la confirmación y abre el login', async ({ page }) => {
  await routeConfirmEmail(page)

  await page.goto(`/confirm-email${search}`)
  const dialog = page.getByRole('dialog', { name: 'Confirmar email' })
  await dialog.getByRole('button', { name: 'Iniciar sesión' }).click()

  await expect(dialog).toBeHidden()
  const login = page.getByRole('dialog', { name: 'Accede a SpaceTraders' })
  await expect(login).toBeVisible()
  await expect(login.getByRole('tab', { selected: true })).toHaveText('Iniciar sesión')
})
