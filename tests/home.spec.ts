import { test, expect } from '@playwright/test'

test('deve exibir o slogan na homepage', async ({ page }) => {
  await page.goto('http://localhost:3000/')

  // Expect a title "to contain" a substring.
  //await expect(page).toHaveTitle(/Playwright/)
  await expect(page).toHaveTitle("Lunar Pass — Passagens para a Lua")

  // sobre substring que vem por padrão ao criar um projeto PW (que tem o barra barra)
  // se quiser testar só o nome da aplicação, uso o entre barras (/ /), aí ele faz um substring 
  // que usa o modelo de contains e não de igual pra fazer a verificação. Assim ele apenas 
  // acessa a ba do navegador e verifica se contem o texto indicado
  //await expect(page).toHaveTitle(/Lunas Pass/) //esse é para falhar msm
  await expect(page).toHaveTitle(/Lunar Pass/)

})

/*
test('get started link', async ({ page }) => {
  await page.goto('https://playwright.dev/')

  // Click the get started link.
  await page.getByRole('link', { name: 'Get started' }).click()

  // Expects page to have a heading with the name of Installation.
  await expect(page.getByRole('heading', { name: 'Installation' })).toBeVisible()
})
*/

