'use server'

<<<<<<< HEAD
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
=======
import { auth, signOut } from "@/auth"
import { cookies } from "next/headers"

const BACKEND_URL = 'http://backend:3001/graphql'

export async function processLogout() {
  const session = await auth()
  const cookieStore = await cookies()

  const token =
    cookieStore.get("__Secure-authjs.session-token")?.value ||
    cookieStore.get("authjs.session-token")?.value

  if (token) {
    const query = `
      mutation Logout {
        logout {
          success
        }
      }
    `

    try {
      await fetch(BACKEND_URL, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({ query })
      })
    } catch (error) {
      console.error('Не удалось уведомить бэкенд о Logout:', error)
    }
  }

  await signOut({ redirectTo: '/auth' })
>>>>>>> a425819849e63eecfc5a85d7a32df2390ec1cc78
}