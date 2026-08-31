'use server'

import { revalidatePath } from "next/cache"
import { getClient } from "@/lib/apollo/client"
import { UPDATE_PROFILE_MUTATION } from "@/graphql/user/mutations/update-profile"
import { UpdateProfileData, updateProfileSchema } from "@/lib/schemas/validation/forms/update-profile"
import { updateProfileResponseSchema } from "@/lib/schemas/api/user"
import { getUserData } from "./user-data"

export async function updateProfile(formData: UpdateProfileData) {
  const session = await getUserData()

  if (!session?.id || !session.name) {
    return { error: "Не авторизован" }
  }

  const result = updateProfileSchema.safeParse(formData)

  if (!result.success) {
    return { error: result.error.issues[0].message }
  }

  const safeInput = result.data

  try {
    const client = await getClient()

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