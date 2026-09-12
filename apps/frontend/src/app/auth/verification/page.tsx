import { redirect } from "next/navigation"
import { cookies } from "next/headers"
import TimesLeft from "./TimesLeft"
import VerifyTrigger from "./VerifyTrigger"
import ResendButton from "./ResendButton"
import { getClient } from "@/lib/apollo/client"
import { TOKEN_DISPATCH_TIME_QUERY } from "@/graphql/user/queries/token-dispatch-time"
import ErrorComponent from "./ErrorComponent"

interface TokenDispatchTimeResponse {
  getTokenDispatchTime: number | null
}

interface VerificationPageProps {
  searchParams: Promise<{ token?: string }>
}

export default async function VerificationPage({ searchParams }: VerificationPageProps) {
  const { token } = await searchParams

  if (token) {
    return <VerifyTrigger token={token} />
  }

  const cookieStore = await cookies()
  const accessToken = cookieStore.get('access_token')?.value

  if (!accessToken) {
    redirect('/auth')
  }

  let dispatchTime: number | null = null
  let hasError = false
  let userEmail = ""

  try {
    const client = await getClient()

    const { data } = await client.query<TokenDispatchTimeResponse>({
      query: TOKEN_DISPATCH_TIME_QUERY,
      fetchPolicy: 'no-cache',
    })

    dispatchTime = data?.getTokenDispatchTime ?? null
  } catch (error) {
    console.error('[Verification Page Error]:', error)
    hasError = true
  }

  if (!dispatchTime) {
    return <ErrorComponent hasError={hasError} />
  }

  const originalExpiresAt = dispatchTime
  const sendTime = new Date(originalExpiresAt - 3600 * 1000)

  return (
    <div className="min-h-screen bg-slate-50 flex items-center justify-center p-4 font-sans select-none">
      <div className="max-w-md w-full bg-white rounded-2xl shadow-xl shadow-slate-200/60 p-8 border border-slate-100 text-center">
        <div className="w-20 h-20 bg-blue-50 text-blue-600 rounded-full flex items-center justify-center mx-auto mb-6">
          <i className="fa-solid fa-at" />
        </div>
        
        <h1 className="text-xl font-bold text-slate-900 leading-tight mb-2">
          Подтверждение адреса электронной почты
        </h1>

        <div className="inline-flex items-center gap-2 px-4 py-2 bg-slate-100 rounded-full text-sm text-slate-600 mb-8">
          <i className="fa-regular fa-clock" />
          <span>
            Время отправки: {' '}
            <b className="text-slate-900">
              {sendTime.toLocaleTimeString('ru-RU', { hour: '2-digit', minute: '2-digit' })}
            </b>{' '}
            (МСК)
          </span>
        </div>

        <div className="w-40 m-auto items-center gap-2 px-4 py-2 bg-slate-100 rounded-full text-sm text-slate-600 mb-8">
          <TimesLeft expiresAt={originalExpiresAt} />
        </div>

        <p className="text-slate-500 mb-8 leading-relaxed">
          Пожалуйста, проверьте почту и подтвердите письмо, чтобы завершить регистрацию.
        </p>

        <div className="mt-6 text-sm text-slate-400">
          Не получили письмо?
          <ResendButton email={userEmail} />
        </div>
      </div>
    </div>
  )
}