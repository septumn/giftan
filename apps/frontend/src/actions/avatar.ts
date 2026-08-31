'use server'

import { revalidatePath } from 'next/cache'
import { minioClient } from '@/lib/minio'
import { auth, unstable_update } from '@/auth'
import { getClient } from '@/lib/apollo/client'
import { v4 as uuidv4 } from 'uuid'
import { UPLOAD_AVATAR_MUTATION } from '@/graphql/user/mutations/upload-avatar'
import { LEGIT_CHECK_QUERY } from '@/graphql/user/queries/legit-check'
import { getUserData } from './user-data'

function isLocalMinioFile(imagePath: string | null | undefined): boolean {
  if (!imagePath) return false;
  return !imagePath.startsWith('http://') && !imagePath.startsWith('https://');
}

export async function uploadAvatarAction(formData: FormData) {
  const user = await getUserData()
  if (!user?.id) return { error: "Unauthorized" }

  const client = await getClient()

  try {
    await client.query({
      query: LEGIT_CHECK_QUERY,
      fetchPolicy: 'no-cache'
    })

    const file = formData.get('file') as File
    if (!file || file.size === 0) return { error: "Файл пуст" }

    const buffer = Buffer.from(await file.arrayBuffer())
    const fileName = `${uuidv4()}.webp`

    if (user.image && isLocalMinioFile(user.image)) {
      await minioClient.removeObject('avatars', user.image).catch(() => { })
    }

    await minioClient.putObject('avatars', fileName, buffer, buffer.length, { 'Content-Type': 'image/webp' })

    await client.mutate({
      mutation: UPLOAD_AVATAR_MUTATION,
      variables: { image: fileName }
    })

    await unstable_update({ user: { image: fileName } })
    revalidatePath('/', 'layout')
    return { success: true, fileName }
  } catch (error) {
    console.error(error)
    return { error: 'Не удалось загрузить аватар' }
  }
}

export async function deleteAvatarAction() {
  const user = await getUserData()
  if (!user?.id) return { error: "Unauthorized" }

  const client = await getClient()

  try {
    await client.query({
      query: LEGIT_CHECK_QUERY,
      fetchPolicy: 'no-cache'
    })

    if (user.image && isLocalMinioFile(user.image)) {
      await minioClient.removeObject('avatars', user.image)
    }

    await client.mutate({
      mutation: UPLOAD_AVATAR_MUTATION,
      variables: { image: null }
    })

    await unstable_update({ user: { image: null } })
    revalidatePath('/', 'layout')
    return { success: true }
  } catch (error) {
    console.error(error)
    return { success: false, error: 'Не удалось удалить аватар' }
  }
}