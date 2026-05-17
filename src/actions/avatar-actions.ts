'use server'

import { revalidatePath } from 'next/cache'
import { minioClient } from '@/lib/minio'
import { db } from '@/db'
import { users } from '@/db/schema'
import { eq } from 'drizzle-orm'
import { auth } from '@/auth'
import { v4 as uuidv4 } from 'uuid'
import { unstable_update } from '@/auth'

export async function uploadAvatarAction(formData: FormData) {
  const session = await auth()
  if (!session?.user?.id) return { error: "Unauthorized" }

  try {
    const file = formData.get('file') as File
    const buffer = Buffer.from(await file.arrayBuffer())
    const fileName = `${uuidv4()}.webp`

    const [user] = await db
      .select({ image: users.image })
      .from(users)
      .where(eq(users.id, session.user.id))

    if (user?.image) {
      await minioClient.removeObject('avatars', user.image).catch(() => { })
    }

    await minioClient.putObject(
      'avatars',
      fileName,
      buffer,
      buffer.length,
      {
        'Content-Type': 'image/webp'
      }
    )

    await db
      .update(users)
      .set({ image: fileName })
      .where(eq(users.id, session.user.id))

    await unstable_update({ user: { image: fileName } })

    revalidatePath('/', 'layout')
    return { success: true, fileName }
  } catch (error) {
    console.error(error)
    return { error: 'Upload failed' }
  }
}

export async function deleteAvatarAction() {
  const session = await auth()

  if (!session) {
    return { error: "Unauthorized", status: 401 }
  }

  const [user] = await db
    .select({ image: users.image })
    .from(users)
    .where(eq(users.id, session.user.id))

  if (!user?.image) return { error: 'Аватар для удаления не найден', response: 404 }

  try {
    await minioClient.removeObject(
      'avatars',
      user.image
    )

    await db
      .update(users)
      .set({ image: null })
      .where(eq(users.id, session.user.id))

    await unstable_update({
      user: {
        image: null
      }
    })

    revalidatePath('/profile')
    return { success: true }
  } catch (error) {
    return { success: false, error: 'Не удалось удалить аватар' }
  }
}