'use server'

import { db } from "@/db"
import { users, activateTokens } from "@/db/schema"
import { hash } from "bcrypt-ts"
import { signIn } from "@/auth"
import { eq, desc } from "drizzle-orm"
import { v4 as uuidv4 } from "uuid"
import { sendVerificationEmail } from "@/lib/sendEmail"
import { revalidatePath } from "next/cache"

export async function registerUser(formData: FormData) {
  const email = formData.get('email') as string
  const name = formData.get('name') as string
  const password = formData.get('password') as string

  if (!email || !name || !password) {
    return { error: "Заполните все поля!" }
  }

  try {
    const existingUser = await db.query.users.findFirst({
      where: (table, { or, eq }) => or(
        eq(table.email, email),
        eq(table.name, name)
      )
    })

    if (existingUser) {
      return { error: "Пользователь с таким email или именем уже существует" }
    }

    const hashedPassword = await hash(password, 10)

    await db.insert(users).values({
      email,
      name,
      password: hashedPassword,
      confirmationSentAt: new Date()
    })

    const token = uuidv4()
    const expires = new Date(Date.now() + 3600 * 1000)

    await db.insert(activateTokens).values({
      email,
      token,
      expires
    })

    const confirmLink = `${process.env.NEXT_APP_URL}/auth/verification?token=${token}`
    await sendVerificationEmail(email, confirmLink)

    await signIn("credentials", {
      email,
      password,
      redirect: false
    })

    return { success: "Пожалуйста, подтвердите почту по ссылке в письме" }
  } catch (error) {
    console.error("Ошибка при регистрации:", error)
    return { error: "Что-то пошло не так при регистрации" }
  }
}

export async function sendMailAgain(email: string) {
  const lastToken = await db.query.activateTokens.findFirst({
    where: (tokens, { eq }) => eq(tokens.email, email),
    orderBy: [desc(activateTokens.expires)]
  })

  if (lastToken) {
    const createdAt = new Date(lastToken.expires.getTime() - 3600 * 1000);
    const diffInSeconds = Math.floor((Date.now() - createdAt.getTime()) / 1000);

    const COOLDOWN = 120;

    if (diffInSeconds < COOLDOWN) {
      return { error: `Подождите ещё ${120 - diffInSeconds} секунд для повторной отправки письма` }
    }
  }

  await db.delete(activateTokens).where(eq(activateTokens.email, email))

  const token = uuidv4()
  const expires = new Date(Date.now() + 3600 * 1000)

  await db.insert(activateTokens).values({
    email,
    token,
    expires
  })

  const confirmLink = `${process.env.NEXT_APP_URL}/auth/verification?token=${token}`
  await sendVerificationEmail(email, confirmLink)

  revalidatePath('/auth/verification')

  return { success: true }
}