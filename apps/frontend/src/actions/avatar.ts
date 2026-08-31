'use server'

import { revalidatePath } from 'next/cache'
import { minioClient } from '@/lib/minio'
import { auth, unstable_update } from '@/auth'
<<<<<<< HEAD
import { getClient } from '@/lib/apollo/client'
import { v4 as uuidv4 } from 'uuid'
import { UPLOAD_AVATAR_MUTATION } from '@/graphql/user/mutations/upload-avatar'
import { LEGIT_CHECK_QUERY } from '@/graphql/user/queries/legit-check'
import { getUserData } from './user-data'
=======
import { getToken } from '@auth/core/jwt'
import { getMutationClient } from '@/lib/apollo/client'
import { v4 as uuidv4 } from 'uuid'
import { cookies, headers } from 'next/headers'
import { UPLOAD_AVATAR_MUTATION } from '@/graphql/user/mutations/upload-avatar'
import { LEGIT_CHECK_QUERY } from '@/graphql/user/queries/legit-check'
>>>>>>> a425819849e63eecfc5a85d7a32df2390ec1cc78

function isLocalMinioFile(imagePath: string | null | undefined): boolean {
  if (!imagePath) return false;
  return !imagePath.startsWith('http://') && !imagePath.startsWith('https://');
}

<<<<<<< HEAD
export async function uploadAvatarAction(formData: FormData) {
  const user = await getUserData()
  if (!user?.id) return { error: "Unauthorized" }

  const client = await getClient()
=======
async function getAuthToken() {
  const allCookies = await cookies()
  const cookieString = allCookies.getAll().map((c) => `${c.name}=${c.value}`).join('; ')
  return await getToken({
    req: { headers: { ...(Object.fromEntries(await headers())), cookie: cookieString } },
    secret: process.env.AUTH_SECRET,
    raw: true
  })
}

export async function uploadAvatarAction(formData: FormData) {
  const session = await auth()
  const token = await getAuthToken()
  if (!session?.user?.id || !token) return { error: "Unauthorized" }

  const client = getMutationClient(token)
>>>>>>> a425819849e63eecfc5a85d7a32df2390ec1cc78

  try {
    await client.query({
      query: LEGIT_CHECK_QUERY,
      fetchPolicy: 'no-cache'
    })

    const file = formData.get('file') as File
    if (!file || file.size === 0) return { error: "Файл пуст" }

    const buffer = Buffer.from(await file.arrayBuffer())
    const fileName = `${uuidv4()}.webp`

<<<<<<< HEAD
    if (user.image && isLocalMinioFile(user.image)) {
      await minioClient.removeObject('avatars', user.image).catch(() => { })
=======
    if (session.user.image && isLocalMinioFile(session.user.image)) {
      await minioClient.removeObject('avatars', session.user.image).catch(() => { })
>>>>>>> a425819849e63eecfc5a85d7a32df2390ec1cc78
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
<<<<<<< HEAD
  const user = await getUserData()
  if (!user?.id) return { error: "Unauthorized" }

  const client = await getClient()
=======
  const session = await auth()
  const token = await getAuthToken()
  if (!session?.user?.id || !token) return { error: "Unauthorized" }

  const client = getMutationClient(token)
>>>>>>> a425819849e63eecfc5a85d7a32df2390ec1cc78

  try {
    await client.query({
      query: LEGIT_CHECK_QUERY,
      fetchPolicy: 'no-cache'
    })

<<<<<<< HEAD
    if (user.image && isLocalMinioFile(user.image)) {
      await minioClient.removeObject('avatars', user.image)
=======
    if (session.user.image && isLocalMinioFile(session.user.image)) {
      await minioClient.removeObject('avatars', session.user.image)
>>>>>>> a425819849e63eecfc5a85d7a32df2390ec1cc78
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