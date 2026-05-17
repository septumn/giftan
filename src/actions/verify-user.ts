'use server'

import { db } from "@/db"
import { activateTokens, users } from "@/db/schema"
import { eq } from "drizzle-orm"
import { unstable_update } from "@/auth"

export async function verifyUser(token: string) {
  const [existingToken] = await db
    .select()
    .from(activateTokens)
    .where(eq(activateTokens.token, token))

  if (!existingToken) {
    return { error: "Токен не найден" }
  }

  const isExpired = new Date(existingToken.expires) < new Date()

  if (isExpired) {
    await db
      .delete(activateTokens)
      .where(eq(activateTokens.id, existingToken.id))

    return { error: "Срок действия токена истёк" }
  }

  const [updatedUser] = await db
    .update(users)
    .set({ emailVerified: new Date() })
    .where(eq(users.email, existingToken.email))
    .returning({ emailVerified: users.emailVerified })

  await db
    .delete(activateTokens)
    .where(eq(activateTokens.id, existingToken.id))

  await unstable_update({
    user: {
      emailVerified: updatedUser.emailVerified
    }
  })

  return { success: true }
}