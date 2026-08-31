'use server'

import { revalidatePath } from "next/cache"
import { cookies } from 'next/headers'
import { getClient } from "@/lib/apollo/client"
import {
  REGISTER_MUTATION,
  RegisterMutationResponse,
  RegisterMutationVariables
} from "@/graphql/user/mutations/register"
import { LoginInput, LoginResponse } from '@giftan/contracts'
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

const NEST_GRAPHQL_URL = process.env.NEST_GRAPHQL_URL || 'http://backend:3001/graphql'

interface ActionResponse {
  success: boolean;
  error?: string;
}

export async function registerUser(formData: FormData): Promise<ActionResponse> {
  const rawName = formData.get('name') as string
  const rawEmail = formData.get('email') as string
  const rawPassword = formData.get('password') as string
  const timestamp = Date.now();
  const finalName = (rawName && rawName.trim() !== "") ? rawName.trim() : `PlaywrightUser${timestamp}`;
  const finalEmail = (rawEmail && rawEmail.trim() !== "") ? rawEmail.trim() : `playwright.${timestamp}@test.com`;
  const finalPassword = (rawPassword && rawPassword.trim() !== "") ? rawPassword : "SuperSecurePassword123!";

  const client = await getClient();

  try {
    const { data, error } = await client.mutate<RegisterMutationResponse, RegisterMutationVariables>({
      mutation: REGISTER_MUTATION,
      variables: {
        input: {
          name: finalName,
          email: finalEmail,
          password: finalPassword
        }
      }
    });

    if (error) {
      console.error(`Сообщение: ${error.message}`)
      return { success: false, error: "Ошибка валидации на сервере" };
    }

    if (data?.register?.success) {
      return { success: true };
    }

    return { success: false, error: "Не удалось получить подтверждение регистрации от сервера" }

  } catch (error) {
    console.error("Ошибка при обращении к Nest.js GraphQL:", error)
    return { success: false, error: "Не удалось связаться с сервером регистрации" }
  }
}

export async function login({ email, password }: { email: string; password?: string }): Promise<LoginResponse> {
  const client = await getClient()

  const cleanEmail = (email || '').trim().toLowerCase();
  const cleanPassword = password || '';

  try {
    const { data, error } = await client.mutate<LoginMutationResponse, LoginMutationVariables>({
      mutation: LOGIN_MUTATION,
      variables: {
        email: cleanEmail,
        password: cleanPassword
      },
      fetchPolicy: 'no-cache',
      context: {
        fetchOptions: {
          cache: 'no-store'
        }
      }
    })

    if (!error && data?.login?.success && data?.login?.accessToken) {

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
      error: data?.login?.error || (error ? 'Сетевая ошибка запроса' : 'Произошла неизвестная ошибка')
    }
  } catch (error) {
    console.error('Критическая ошибка в мутации:', error);
    return { success: false, error: error instanceof Error ? error.message : String(error) }
  }
}

export async function sendMailAgain(email: string): Promise<ResendEmailMutationResult> {
  const client = await getClient()

  try {
    const { data, error } = await client.mutate<ResendEmailMutationResponse, ResendEmailMutationVariables>({
      mutation: RESEND_EMAIL_MUTATION,
      variables: { email }
    })

    if (error) {
      return { success: false, error: error.message || "Не удалось переотправить письмо" }
    }

    if (data?.resendVerificationEmail?.success) {
      revalidatePath('/auth/verification')
      return { success: true }
    }

    return { success: false, error: "Сервер не подтвердил отправку письма" }

  } catch (error) {
    console.error("Ошибка повторной отправки письма:", error)
    return { success: false, error: "Не удалось отправить письмо. Попробуйте позже." }
  }
}

export async function verifyEmailToken(token: string): Promise<VerifyEmailMutationResult> {
  if (!token) {
    return { success: false, emailVerified: null, error: "Токен отсутствует" }
  }

  const client = await getClient()

  try {
    const { data, error } = await client.mutate<VerifyEmailMutationResponse, VerifyEmailMutationVariables>({
      mutation: VERIFY_MUTATION,
      variables: { token }
    })

    const dataEmailVerified = data?.verifyEmail?.emailVerified as string

    if (error) {
      return { success: false, emailVerified: null, error: error.message || "Ошибка верификации" }
    }

    if (data?.verifyEmail?.success) {
      return { success: true, emailVerified: dataEmailVerified }
    }

    return { success: false, emailVerified: null, error: "Не удалось подтвердить почту" }

  } catch (error) {
    console.error("Ошибка при верификации через бэкенд:", error)
    return { success: false, emailVerified: null, error: "Не удалось связаться с сервером верификации" }
  }
}