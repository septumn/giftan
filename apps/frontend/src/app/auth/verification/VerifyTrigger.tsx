'use client'

<<<<<<< HEAD
import { useEffect, useRef } from "react"
import { redirect, useRouter } from "next/navigation"
import { login, verifyEmailToken } from "@/actions/auth"
=======
import { useEffect, useRef, useState } from "react"
import { useRouter } from "next/navigation"
import { useSession } from "next-auth/react"
import { verifyEmailToken } from "@/actions/auth"
>>>>>>> a425819849e63eecfc5a85d7a32df2390ec1cc78
import { toast } from "sonner"

export default function VerifyTrigger({ token }: { token: string }) {
  const called = useRef(false)
  const router = useRouter()
<<<<<<< HEAD
=======
  const { update } = useSession()
  const [status, setStatus] = useState("Активация вашего аккаунта...")
>>>>>>> a425819849e63eecfc5a85d7a32df2390ec1cc78

  useEffect(() => {
    if (called.current) return
    called.current = true

    async function run() {
      const res = await verifyEmailToken(token)

      if (res.success) {
        toast.success("Аккаунт успешно активирован!")
<<<<<<< HEAD
        redirect('/profile')
=======
        setStatus("Email подтвержден! Обновляем профиль...")

        await update({ user: { emailVerified: true } })

        router.push('/profile')
        router.refresh()
>>>>>>> a425819849e63eecfc5a85d7a32df2390ec1cc78
      } else {
        toast.error(res.error || "Срок действия ссылки истек или токен недействителен")
        router.push('/')
      }
    }

    run()
<<<<<<< HEAD
  }, [token, router])
=======
  }, [token, router, update])
>>>>>>> a425819849e63eecfc5a85d7a32df2390ec1cc78

  return (
    <div className="min-h-screen flex items-center justify-center">
      <div className="animate-spin w-8 h-8 border-4 border-blue-600 border-t-transparent rounded-full" />
    </div>
  )
}