import { test, expect } from '@playwright/test';
import { PrismaClient } from '@prisma/client';
import { PrismaPg } from '@prisma/adapter-pg';
import { Pool } from 'pg';
import * as dotenv from 'dotenv';
import path from 'path';

dotenv.config({ path: path.resolve(__dirname, '../.env') });

test.describe('Auth Flow', () => {
  let prisma: PrismaClient;
  let pool: Pool;

  test.beforeAll(async () => {
    const connectionString = process.env.DATABASE_URL;
    if (!connectionString) throw new Error('DATABASE_URL is missing');

    // Создаем реальный пул соединений (драйвер)
    pool = new Pool({ connectionString });
    const adapter = new PrismaPg(pool);

    // Передаем адаптер в Prisma. Теперь она НЕ БУДЕТ ругаться на пустой конструктор!
    prisma = new PrismaClient({ adapter });
  });

  test.afterAll(async () => {
    await prisma.$disconnect();
    await pool.end(); // Закрываем пул соединений
  });

  test('полный цикл верификации', async ({ page }) => {
    const testEmail = `test-${Date.now()}@example.com`;

    // 1. Регистрация
    await page.goto('http://localhost:3000/auth');
    await page.getByRole('button', { name: 'Регистрация' }).click();
    await page.fill('input[name="name"]', `Tester-${Date.now()}`);
    await page.fill('input[name="email"]', testEmail);
    await page.fill('input[name="password"]', 'Password123!');
    await page.fill('input[name="confirmPassword"]', 'Password123!');
    await page.getByTestId('agreement-span').click();
    await page.getByRole('button', { name: 'Зарегистрироваться' }).click();

    await expect(page).toHaveURL(/\/auth\/verification/, { timeout: 10000 });

    // 2. Ищем токен (теперь Prisma работает через адаптер)
    const verifData = await prisma.activateToken.findFirst({
      where: { email: testEmail }
    });

    if (!verifData) throw new Error('Токен не найден');

    // 3. Верификация
    await page.goto(`/auth/verification?token=${verifData.token}`);

    // 4. Проверка
    await expect(page).toHaveURL('/profile', { timeout: 15000 });

    const user = await prisma.user.findUnique({ where: { email: testEmail } });
    expect(user?.emailVerified).not.toBeNull();

    await expect(page.locator('body'), 'Критическая ошибка: на странице найден текст "nope", которого быть не должно!')
      .not.toContainText('nope');
  });
});