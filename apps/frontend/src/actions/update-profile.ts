'use server'

import { auth, unstable_update } from "@/auth"
import { revalidatePath } from "next/cache"
import { cookies, headers } from "next/headers"
import { getToken } from "@auth/core/jwt"
import { getMutationClient } from "@/lib/apollo/client"
import { UPDATE_PROFILE_MUTATION } from "@/graphql/user/mutations/update-profile"
import { UpdateProfileData, updateProfileSchema } from "@/lib/schemas/forms/update-profile"
import { updateProfileResponseSchema } from "@/lib/schemas/api/user"

export async function updateProfile(formData: UpdateProfileData) {
  const session = await auth()

  if (!session || !session.user) {
    return { error: "Не авторизован" }
  }

  const result = updateProfileSchema.safeParse(formData)

  if (!result.success) {
    return { error: result.error.issues[0].message }
  }

  const safeInput = result.data

  const allCookies = await cookies()
  const cookieString = allCookies
    .getAll()
    .map((c) => `${c.name}=${c.value}`)
    .join('; ')

  const token = await getToken({
    req: {
      headers: {
        ...(Object.fromEntries(await headers())),
        cookie: cookieString,
      },
    },
    secret: process.env.AUTH_SECRET,
    raw: true
  })

  if (!token) {
    return { error: "Токен сессии не найден в куках фронтенда" }
  }

  try {
    const client = await getMutationClient(token)

    const cleanBio = typeof safeInput.bio === 'string' ? safeInput.bio.trim() : '';

    const { data } = await client.mutate({
      mutation: UPDATE_PROFILE_MUTATION,
      variables: {
        input: {
          name: safeInput.name,
          bio: cleanBio === '' ? null : safeInput.bio
        }
      },
      fetchPolicy: 'no-cache'
    })

    const parsed = updateProfileResponseSchema.safeParse(data)

    if (!parsed.success) {
      console.error("Ошибка валидации ответа Nest.js:", parsed.error.format())
      return { error: 'Неверный формат данных от сервера бэкенда' }
    }

    const updatedUser = parsed.data.updateProfile

    await unstable_update({
      user: {
        name: updatedUser.name,
        bio: updatedUser.bio ?? null
      }
    })

    revalidatePath('/profile')
    return { success: true }
  } catch (error: any) {
    console.error('Backend invocation failed:', error);

    if (error.graphQLErrors && error.graphQLErrors.length > 0) {
      const firstError = error.graphQLErrors[0];
      const validationMessages =
        firstError.extensions?.originalError?.message ||
        firstError.extensions?.response?.message;

      if (Array.isArray(validationMessages)) {
        return { error: validationMessages.join(', ') };
      }

      return { error: firstError.message || 'Ошибка валидации на бэкенде' };
    }

    return { error: error.message || 'Сервер бэкенда недоступен' };
  }
}