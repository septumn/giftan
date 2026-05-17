'use server'

import { db } from "@/db"
import { users } from "@/db/schema"
import { eq } from "drizzle-orm"
import { auth, unstable_update } from "@/auth"
import { revalidatePath } from "next/cache"

export async function updateProfile(formData: { name: string, bio: string }) {
  const session = await auth()
  const userEmail = session?.user?.email

  if (!userEmail) {
    return { error: "Не авторизован" }
  }

  const cleanName = (formData.name || "").trim()
  const cleanBio = (formData.bio || "").trim()

  if (cleanName.length < 3 || cleanName.length > 25) {
    return { error: "Имя должно быть от 3 до 25 символов" }
  }

  const nameRegex = /^[a-zA-Z0-9_А-Яа-я ]+$/
  if (!nameRegex.test(cleanName)) {
    return { error: "Имя может содержать только буквы, цифры и нижнее подчеркивание" }
  }

  if (cleanBio.length > 150) {
    return { error: "Описание не должно превышать 150 символов" }
  }

  try {
    const [existingUser] = await db
      .select({ email: users.email })
      .from(users)
      .where(eq(users.name, cleanName))

    const isNameTaken = existingUser && existingUser.email !== userEmail

    const updateData = isNameTaken
      ? { bio: cleanBio || null }
      : { name: cleanName, bio: cleanBio || null }

    const [updatedUser] = await db
      .update(users)
      .set(updateData)
      .where(eq(users.email, userEmail))
      .returning({ name: users.name, bio: users.bio })

    await unstable_update({
      user: {
        name: updatedUser.name,
        bio: updatedUser.bio,
      }
    })

    revalidatePath('/profile')

    if (isNameTaken) {
      return { success: true, nameError: 'Это имя пользователя уже занято' }
    }

    return { success: true }
  } catch {
    return { error: 'Ошибка при обновлении данных' }
  }
}