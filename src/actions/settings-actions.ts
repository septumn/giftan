import { db } from "@/db"
import { users } from "@/db/schema"
import { eq } from "drizzle-orm"
import { compare, hash } from "bcrypt-ts"
import { auth } from "@/auth"
import { ChangePasswordData, changePasswordSchema } from "@/lib/schemas"

export interface ActionResponse {
  success: boolean
  error: string | null
}

export async function changePassword({ oldPassword, newPassword }: ChangePasswordData): Promise<ActionResponse> {
  const session = await auth()

  if (!session?.user?.id) return { success: false, error: "Unauthorized" }

  const data = {
    oldPassword,
    newPassword
  }

  const validation = changePasswordSchema.safeParse(data)

  if (!validation.success) {
    return { success: false, error: validation.error.issues[0]?.message || 'Ошибка валидации' }
  }

  try {
    const [user] = await db
      .select({ password: users.password })
      .from(users)
      .where(eq(users.id, session.user.id))

    if (!user?.password) return { success: false, error: 'Пароль не установлен в этом аккаунте' }

    const isMatch = await compare(oldPassword, user.password)

    if (isMatch) {
      const hashedPassword = await hash(newPassword, 10)

      await db
        .update(users)
        .set({ password: hashedPassword })
        .where(eq(users.id, session.user.id))

      return { success: true, error: null }
    } else {
      return { success: false, error: 'Не верный пароль' }
    }
  } catch {
    return { success: false, error: 'Ошибка обновления пароля' }
  }
}