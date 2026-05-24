import { db } from "@/db"
import { activateTokens, users } from "@/db/schema"
import { desc } from "drizzle-orm"
import { redirect } from "next/navigation"
import { auth } from "@/auth"
import TimesLeft from "./TimesLeft"
import VerifyTrigger from "./VerifyTrigger"
import ResendButton from "./ResendButton"

export default async function VerificationPage({
  searchParams
}: {
  searchParams: Promise<{ token: string }>
}) {
  const { token } = await searchParams

  if (token) {
    return <VerifyTrigger token={token} />
  }

  const session = await auth()
  const email = session?.user?.email

  if (!email) redirect('/auth')

  const dispatchTime = await db.query.activateTokens.findFirst({
    where: (tokens, { eq }) => eq(tokens.email, email),
    orderBy: [desc(activateTokens.expires)]
  })

  if (!dispatchTime) {
    const user = await db.query.users.findFirst({
      where: (user, { eq }) => eq(user.email, email)
    })

    if (user?.emailVerified) redirect('/profile')

    return <div className="p-10 text-center">Ссылка для подтверждения не найдена. Попробуйте отправить письмо снова.</div>
  }

  return (

    <div className="min-h-screen bg-slate-50 flex items-center justify-center p-4 font-sans">
      <div className="max-w-md w-full bg-white rounded-2xl shadow-xl shadow-slate-200/60 p-8 border border-slate-100 text-center">
        <div className="w-20 h-20 bg-blue-50 text-blue-600 rounded-full flex items-center justify-center mx-auto mb-6">
          <i className="fa-solid fa-at"></i>
        </div>
        <h1 className="text-xl font-bold text-slate-900 leading-tight mb-2">
          Мы отправили вам письмо по адресу:
        </h1>
        <div className="text-blue-600 font-semibold break-all mb-6">{email}</div>
        <div className="inline-flex items-center gap-2 px-4 py-2 bg-slate-100 rounded-full text-sm text-slate-600 mb-8">
          <i className="fa-regular fa-clock"></i>
          <span>Время отправки: <b className="text-slate-900">{new Date(dispatchTime.expires.getTime() - 3600000).toLocaleTimeString('ru-RU', { hour: '2-digit', minute: '2-digit' })}</b> (МСК)</span>
        </div>
        <div className="w-40 m-auto items-center gap-2 px-4 py-2 bg-slate-100 rounded-full text-sm text-slate-600 mb-8">
          <TimesLeft expiresAt={dispatchTime.expires.getTime()} />
        </div>
        <p className="text-slate-500 mb-8 leading-relaxed">
          Пожалуйста, проверьте почту и подтвердите письмо, чтобы завершить регистрацию.
        </p>
        <div className="mt-6 text-sm text-slate-400">
          Не получили письмо?
          <ResendButton email={email} />
        </div>
      </div>
    </div>
  )
}