'use server'

import { revalidatePath } from "next/cache"
import { unstable_update } from "@/auth"

interface RegisterActionResponse {
  success?: boolean;
  error?: string;
}

const NEST_GRAPHQL_URL = 'http://backend:3001/graphql'

export async function registerUser(formData: FormData): Promise<RegisterActionResponse> {
  const email = formData.get('email') as string
  const name = formData.get('name') as string
  const password = formData.get('password') as string

  if (!email || !name || !password) {
    return { error: "Заполните все поля!" }
  }

  try {
    const REGISTER_MUTATION = `
      mutation Register($input: RegisterInput!) {
        register(input: $input) {
          success
          user { id name email role }
        }
      }
    `

    const response = await fetch(NEST_GRAPHQL_URL, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        query: REGISTER_MUTATION,
        variables: { input: { email, name, password } },
      }),
    })

    const { data, errors } = await response.json()

    if (errors && errors.length > 0) {
      return { error: errors[0].message || "Ошибка при регистрации" }
    }

    if (data?.register?.success) {
      return { success: true }
    }

    return { error: "Не удалось получить подтверждение регистрации от сервера" }

  } catch (error) {
    console.error("Ошибка при обращении к Nest.js GraphQL:", error)
    return { error: "Не удалось связаться с сервером регистрации" }
  }
}

export async function sendMailAgain(email: string) {
  try {
    const RESEND_MUTATION = `
      mutation ResendVerification($email: String!) {
        resendVerificationEmail(email: $email) {
          success
        }
      }
    `

    const response = await fetch(NEST_GRAPHQL_URL, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        query: RESEND_MUTATION,
        variables: { email }
      }),
    })

    const { data, errors } = await response.json()

    if (errors && errors.length > 0) {
      return { error: errors[0].message || "Не удалось переотправить письмо" }
    }

    if (data?.resendVerificationEmail?.success) {
      revalidatePath('/auth/verification')
      return { success: true }
    }

    return { error: "Сервер не подтвердил отправку письма" }

  } catch (error) {
    console.error("Ошибка повторной отправки письма:", error)
    return { error: "Не удалось отправить письмо. Попробуйте позже." }
  }
}

export async function verifyEmailToken(token: string) {
  if (!token) {
    return { error: "Токен отсутствует" }
  }

  try {
    const VERIFY_MUTATION = `
      mutation Verify($token: String!) {
        verifyEmail(token: $token) {
          success
          emailVerified
        }
      }
    `

    const response = await fetch(NEST_GRAPHQL_URL, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        query: VERIFY_MUTATION,
        variables: { token }
      }),
    })

    const { data, errors } = await response.json()

    const dataEmailVerified = data?.verifyEmail?.emailVerified

    if (errors && errors.length > 0) {
      return { error: errors[0].message || "Ошибка верификации" }
    }

    if (data?.verifyEmail?.success) {
      await unstable_update({
        user: {
          emailVerified: dataEmailVerified
        }
      });

      return { success: true }
    }

    return { error: "Не удалось подтвердить почту" }

  } catch (error) {
    console.error("Ошибка при верификации через бэкенд:", error)
    return { error: "Не удалось связаться с сервером верификации" }
  }
}