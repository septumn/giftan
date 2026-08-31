'use server'

import { cookies } from "next/headers"
import { LOGOUT_MUTATION, LogoutMutationResponse } from "@/graphql/user/mutations/logout"
import { getClient } from "@/lib/apollo/client"
import { UserType } from "@/types/user"

export async function processLogout(userId: UserType['id']) {
  const cookieStore = await cookies()

  const token =
    cookieStore.get("__Secure.access_token")?.value ||
    cookieStore.get("access_token")?.value

  const client = await getClient()

  if (token) {
    try {
      const { data, error } = await client.mutate<LogoutMutationResponse>({
        mutation: LOGOUT_MUTATION
      })

    } catch (error) {
      console.error('Не удалось уведомить бэкенд о Logout:', error)
      return { success: false }
    }
  }

  cookieStore.delete('access_token')
  cookieStore.delete('__Secure.access_token')
}