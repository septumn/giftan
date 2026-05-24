'use server'

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
}