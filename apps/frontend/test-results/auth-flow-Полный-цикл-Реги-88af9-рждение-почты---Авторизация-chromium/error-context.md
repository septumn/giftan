# Instructions

- Following Playwright test failed.
- Explain why, be concise, respect Playwright best practices.
- Provide a snippet of code with the fix, if possible.

# Test info

- Name: auth-flow.spec.ts >> Полный цикл: Регистрация -> Подтверждение почты -> Авторизация
- Location: tests/auth-flow.spec.ts:7:5

# Error details

```
Error: expect(locator).toBeVisible() failed

Locator: locator('text=Мы отправили письмо')
Expected: visible
Timeout: 5000ms
Error: element(s) not found

Call log:
  - Expect "toBeVisible" with timeout 5000ms
  - waiting for locator('text=Мы отправили письмо')

```

```yaml
- banner:
  - link " Giftan":
    - /url: /
    - text: 
    - heading "Giftan" [level=1]
  - textbox "Поиск подарков..."
  - button " Найти"
  - link " Избранное":
    - /url: "#"
  - link " Корзина":
    - /url: /cart
  - link " Авторизация":
    - /url: /auth
  - link " Telegram":
    - /url: https://t.me/gifton_bot
  - navigation:
    - list:
      - listitem:
        - link "Главная":
          - /url: /
      - listitem:
        - link "Каталог":
          - /url: /catalog
      - listitem:
        - link "Новинки":
          - /url: /new-gifts
      - listitem:
        - link "Звёзды":
          - /url: /stars
- text: 
- heading "Создайте аккаунт" [level=1]
- paragraph: Заполните форму для регистрации
- button "Вход"
- button "Регистрация"
- text: Имя
- textbox "Ваше имя": test
- text: Email
- textbox "example@mail.com": user-1779886545132@test.com
- text: Пароль
- textbox "Минимум 8 символов": SecurePassword123!
- button "👁️"
- text: Надёжный Подтвердите пароль
- textbox "Повторите пароль": SecurePassword123!
- button "👁️"
- checkbox "✓ Я согласен с условиями использования и политикой конфиденциальности" [checked]
- text: ✓ Я согласен с
- link "условиями использования":
  - /url: "#"
- text: и
- link "политикой конфиденциальности":
  - /url: "#"
- button "Зарегистрироваться"
- text: или
- button "Google":
  - img
  - text: Google
- button "VK":
  - img
  - text: VK
- paragraph:
  - text: Уже есть аккаунт?
  - button "Войти"
- region "Notifications alt+T"
- contentinfo:
  - heading "Giftan" [level=3]
  - paragraph: Маркетплейс телеграм подарков для любых поводов. Дарим внимание и радость с 2026 года.
  - link "":
    - /url: https://t.me/gifton_bot
  - link "":
    - /url: "#"
  - link "":
    - /url: "#"
  - link "":
    - /url: "#"
  - heading "Категории" [level=3]
  - paragraph:
    - link "Для неё":
      - /url: "#"
  - paragraph:
    - link "Для него":
      - /url: "#"
  - paragraph:
    - link "Хиты":
      - /url: "#"
  - paragraph:
    - link "Лучшие":
      - /url: "#"
  - heading "Информация" [level=3]
  - paragraph:
    - link "О нас":
      - /url: "#"
  - paragraph:
    - link "Доставка и оплата":
      - /url: "#"
  - paragraph:
    - link "Возврат":
      - /url: "#"
  - paragraph:
    - link "Отзывы":
      - /url: "#"
  - heading "Контакты" [level=3]
  - paragraph:  +7 (999) 123-45-67
  - paragraph:  info@gifton.ru
  - paragraph:  @giftan_bot
  - paragraph: © 2026 Giftan. Все права защищены.
- alert
```

# Test source

```ts
  1  | import { test, expect } from '@playwright/test'
  2  | 
  3  | const testName = 'test'
  4  | const testEmail = `user-${Date.now()}@test.com`
  5  | const testPassword = 'SecurePassword123!'
  6  | 
  7  | test('Полный цикл: Регистрация -> Подтверждение почты -> Авторизация', async ({ page, request }) => {
  8  |   await page.goto('http://localhost:3000/auth')
  9  |   await expect(page).toHaveURL(/.*auth/)
  10 | 
  11 |   await page.click('text=Регистрация')
  12 | 
  13 |   await page.fill('input[name="name"]', testName)
  14 |   await page.fill('input[type="email"]', testEmail)
  15 |   await page.fill('input[type="password"]', testPassword)
  16 |   await page.fill('input[name="confirmPassword"]', testPassword)
  17 |   await page.getByTestId('agreement-span').click()
  18 | 
  19 |   await page.click('button:has-text("Зарегистрироваться")')
  20 | 
  21 |   await page.waitForTimeout(3000)
  22 | 
> 23 |   await expect(page.locator('text=Мы отправили письмо')).toBeVisible()
     |                                                          ^ Error: expect(locator).toBeVisible() failed
  24 | 
  25 |   await expect(page).toHaveURL('http://localhost:3000/auth/verification')
  26 | 
  27 |   const graphqlResponse = await request.post('http://localhost:3001/graphql', {
  28 |     data: {
  29 |       query: `
  30 |         query GetTokenTest($email: String!) {
  31 |           getTokenTest(email: $email)
  32 |         }
  33 |       `,
  34 |       variables: { email: testEmail }
  35 |     }
  36 |   });
  37 | 
  38 |   const jsonResult = await graphqlResponse.json();
  39 |   const activationToken = jsonResult.data?.getTokenTest;
  40 | 
  41 |   expect(activationToken).toBeTruthy()
  42 | 
  43 |   await page.goto(`http://localhost:3000/auth/verification?token=${activationToken}`);
  44 | 
  45 |   await expect(page).toHaveURL('http://localhost:3000/profile', { timeout: 10000 })
  46 |   await expect(page.locator('h1[class*="profileName"]')).toContainText(testName)
  47 | })
```