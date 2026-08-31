import { test, expect } from '@playwright/test'

test('Полный цикл: Регистрация -> Подтверждение почты -> Авторизация -> Выход (Logout)', async ({ page, request }) => {
  const timestamp = Date.now();
  const testName = `User${timestamp}`;
  const testEmail = `playwright-${timestamp}@test.com`;
  const testPassword = 'SuperSecurePassword123!';

  // 1. ПЕРЕХОД НА СТРАНИЦУ И ПЕРЕКЛЮЧЕНИЕ НА РЕГИСТРАЦИЮ
  await page.goto('http://localhost:3000/auth')
  await expect(page).toHaveURL(/.*auth/)

  // Кликаем строго по кнопке "Регистрация" из переключателя посередине экрана
  await page.click('button:has-text("Регистрация")')

  // 2. ЗАПОЛНЕНИЕ ПОЛЕЙ РЕГИСТРАЦИИ
  await page.fill('input[name="name"]', testName)
  await page.fill('input[type="email"]', testEmail)
  await page.fill('input[type="password"]', testPassword)
  await page.fill('input[name="confirmPassword"]', testPassword)
  await page.getByTestId('agreement-span').click()

  // 3. ОТПРАВКА ФОРМЫ РЕГИСТРАЦИИ
  await page.click('button:has-text("Зарегистрироваться")')

  // Ждем, пока бэкенд обработает запрос и перенаправит нас на страницу верификации
  await page.waitForURL('**/auth/verification', { timeout: 15000 })

  // 4. ЗАПРОС ТОКЕНА АКТИВАЦИИ НАПРЯМУЮ ИЗ ТЕСТОВОЙ РУЧКИ БЭКЕНДА
  const graphqlResponse = await request.post('http://localhost:3001/graphql', {
    data: {
      query: `
        query GetTokenTest($email: String!) {
          getTokenTest(email: $email)
        }
      `,
      variables: { email: testEmail }
    }
  });

  const jsonResult = await graphqlResponse.json();
  const activationToken = jsonResult.data?.getTokenTest;
  expect(activationToken).toBeTruthy()

  await page.goto(`http://localhost:3000/auth/verification?token=${activationToken}`)

  await page.waitForURL('**/profile', { timeout: 15000 })

  // Кликаем по кнопке "Вход" (переключатель посередине, который мы видели на скриншоте)

  await page.getByRole('button').nth(1).click()
  
  await page.click('button:has-text("Выйти")')

  await page.waitForURL('**/auth', { timeout: 15000 })

  await page.click('button:has-text("Вход")')

  // Заполняем поля авторизации активированного юзера
  await page.fill('input[type="email"]', testEmail)
  await page.fill('input[type="password"]', testPassword)

  // Нажимаем на большую синюю кнопку "Войти" в самом низу формы
  await page.click('button:has-text("Войти")')

  // 7. ПРОВЕРКА ВХОДА В ЛИЧНЫЙ КАБИНЕТ
  await page.waitForURL('**/profile', { timeout: 15000 })
  await expect(page.locator('h1[class*="profileName"]')).toContainText(testName)

  // Проверяем, что сессионная кука access_token проставилась в браузере
  const context = page.context();
  const cookiesBefore = await context.cookies();
  const hasTokenBefore = cookiesBefore.some(c => c.name === 'access_token');
  expect(hasTokenBefore).toBe(true);

  // 8. ТЕСТИРОВАНИЕ МУТАЦИИ LOGOUT (НАЖИМАЕМ КНОПКУ ВЫХОДА)
  await page.click('button:has-text("Выйти")')
  await page.waitForURL('**/auth', { timeout: 10000 })
  await expect(page).toHaveURL(/.*auth/)

  // Проверяем, что кука удалилась из контекста браузера
  const cookiesAfter = await context.cookies();
  const hasTokenAfter = cookiesAfter.some(c => c.name === 'access_token');
  expect(hasTokenAfter).toBe(false);

  // 9. ПРОВЕРКА БЛЭКЛИСТА В REDIS (Пытаемся вызвать защищенную ручку с аннулированным токеном)
  const checkBlacklist = await page.evaluate(async (email) => {
    const res = await fetch('http://localhost:3001/graphql', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        query: `
          query {
            getTokenDispatchTime(email: "${email}")
          }
        `
      })
    });
    return res.json();
  }, testEmail);

  expect(checkBlacklist.errors).toBeDefined();
  expect(checkBlacklist.errors[0].message).toMatch(/(Токен авторизации отсутствует|Сессия была аннулирована|не найден)/i);
})