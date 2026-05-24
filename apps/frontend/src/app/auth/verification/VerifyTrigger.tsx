'use client'

import { useEffect, useRef, useState } from "react"
import { useRouter } from "next/navigation"
import { useSession } from "next-auth/react"
import { verifyEmailToken } from "@/actions/auth"
import { toast } from "sonner"

export default function VerifyTrigger({ token }: { token: string }) {
  const called = useRef(false)
  const router = useRouter()
  const { update } = useSession()
  const [status, setStatus] = useState("Активация вашего аккаунта...")

  useEffect(() => {
    if (called.current) return
    called.current = true

    async function run() {
      const res = await verifyEmailToken(token)

      if (res.success) {
        toast.success("Аккаунт успешно активирован!")
        setStatus("Email подтвержден! Обновляем профиль...")

        await update({ user: { emailVerified: true } })

        router.push('/profile')
        router.refresh()
      } else {
        toast.error(res.error || "Срок действия ссылки истек или токен недействителен")
        router.push('/')
      }
    }

    run()
  }, [token, router, update])

  return (
    <div className="min-h-screen flex items-center justify-center">
      <div className="animate-spin w-8 h-8 border-4 border-blue-600 border-t-transparent rounded-full" />
    </div>
  )
}