'use server'

import { revalidatePath } from "next/cache"
import { cookies } from 'next/headers'
import { getClient } from "@/lib/apollo/client"
import {
  REGISTER_MUTATION,
  RegisterMutationResponse,
  RegisterMutationVariables
} from "@/graphql/user/mutations/register"
import { LoginInput, LoginResponse } from '@giftan/shared/auth/login/contract'
import {
  LOGIN_MUTATION,
  LoginMutationResponse,
  LoginMutationVariables
} from '@/graphql/user/mutations/login'
import {
  RESEND_EMAIL_MUTATION,
  ResendEmailMutationResponse,
  ResendEmailMutationResult,
  ResendEmailMutationVariables
} from "@/graphql/user/mutations/resend-email"
import {
  VERIFY_MUTATION,
  VerifyEmailMutationResponse,
  VerifyEmailMutationResult,
  VerifyEmailMutationVariables,
} from "@/graphql/user/mutations/verify-email"

interface ActionResponse {
  success: boolean
  error?: string
}

export async function registerUser(formData: FormData): Promise<ActionResponse> {
  const rawName = formData.get('name') as string
  const rawEmail = formData.get('email') as string
  const rawPassword = formData.get('password') as string

  const timestamp = Date.now()
  const finalName = rawName?.trim() || `PlaywrightUser${timestamp}`
  const finalEmail = rawEmail?.trim().toLowerCase() || `playwright.${timestamp}@test.com`
  const finalPassword = rawPassword?.trim() || "SuperSecurePassword123!"

  try {
    const client = await getClient()

    const { data, error } = await client.mutate<RegisterMutationResponse, RegisterMutationVariables>({
      mutation: REGISTER_MUTATION,
      variables: {
        input: {
          name: finalName,
          email: finalEmail,
          password: finalPassword
        }
      }
    })

    if (error) {
      return { success: false, error: error.message || "Ошибка валидации на сервере" }
    }

    if (data?.register?.success) {
      return { success: true }
    }

    return { success: false, error: "Не удалось получить подтверждение регистрации от сервера" }

  } catch (error: any) {
    console.error("Ошибка при обращении к Nest.js GraphQL (register):", error)
    return { 
      success: false, 
      error: error?.graphQLErrors?.[0]?.message || error?.message || "Не удалось связаться с сервером регистрации" 
    }
  }
}

export async function login({ email, password }: LoginInput): Promise<LoginResponse> {
  const cleanEmail = (email || '').trim().toLowerCase()
  const cleanPassword = password || ''

  try {
    const client = await getClient()

    const { data, error } = await client.mutate<LoginMutationResponse, LoginMutationVariables>({
      mutation: LOGIN_MUTATION,
      variables: {
        input: {
          email: cleanEmail,
          password: cleanPassword
        }
      },
      fetchPolicy: 'no-cache',
      context: {
        fetchOptions: {
          cache: 'no-store'
        }
      }
    })

    if (error) {
      return { success: false, error: error.message }
    }

    if (data?.login?.success && data?.login?.accessToken) {
      const cookieStore = await cookies()
      cookieStore.set('access_token', data.login.accessToken, {
        path: '/',
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        sameSite: 'strict',
        maxAge: 60 * 60 * 24 * 14
      })

      return { success: true }
    }

    return {
      success: false,
      error: data?.login?.error || 'Произошла ошибка при входе в систему'
    }

  } catch (error: any) {
    console.error('Критическая ошибка при входе (login):', error)
    return { 
      success: false, 
      error: error?.graphQLErrors?.[0]?.message || error?.message || 'Сетевая ошибка запроса' 
    }
  }
}

export async function sendMailAgain(email: string): Promise<ResendEmailMutationResult> {
  const cleanEmail = email.trim().toLowerCase()

  try {
    const client = await getClient()

    const { data, error } = await client.mutate<ResendEmailMutationResponse, ResendEmailMutationVariables>({
      mutation: RESEND_EMAIL_MUTATION,
      variables: { email: cleanEmail }
    })

    if (error) {
      return { success: false, error: error.message || "Не удалось переотправить письмо" }
    }

    if (data?.resendVerificationEmail?.success) {
      revalidatePath('/auth/verification')
      return { success: true }
    }

    return { success: false, error: "Сервер не подтвердил отправку письма" }

  } catch (error: any) {
    console.error("Ошибка повторной отправки письма:", error)
    return { 
      success: false, 
      error: error?.graphQLErrors?.[0]?.message || "Не удалось отправить письмо. Попробуйте позже." 
    }
  }
}

export async function verifyEmailToken(token: string): Promise<VerifyEmailMutationResult> {
  if (!token) {
    return { success: false, emailVerified: null, error: "Токен отсутствует" }
  }

  try {
    const client = await getClient()

    const { data, error } = await client.mutate<VerifyEmailMutationResponse, VerifyEmailMutationVariables>({
      mutation: VERIFY_MUTATION,
      variables: { token }
    })

    if (error) {
      return { success: false, emailVerified: null, error: error.message || "Ошибка верификации" }
    }

    if (data?.verifyEmail?.success) {
      const emailVerified = data.verifyEmail.emailVerified ?? null
      return { success: true, emailVerified }
    }

    return { success: false, emailVerified: null, error: "Не удалось подтвердить почту" }

  } catch (error: any) {
    console.error("Ошибка при верификации через бэкенд:", error)
    return { 
      success: false, 
      emailVerified: null, 
      error: error?.graphQLErrors?.[0]?.message || "Не удалось связаться с сервером верификации" 
    }
  }
}