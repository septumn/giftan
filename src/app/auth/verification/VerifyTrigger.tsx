'use client'

import { useEffect, useRef } from "react"
import { useRouter } from "next/navigation"
import { verifyUser } from "@/actions/verify-user"
import { toast } from "sonner"

export default function VerifyTrigger({ token }: { token: string }) {
  const called = useRef(false)
  const router = useRouter()

  useEffect(() => {
    if (called.current) return
    called.current = true

    async function run() {
      const res = await verifyUser(token)

      if (res.success) {
        router.refresh()
        router.push('/profile')
      } else {
        toast.error(res.error)
        router.push('/')
      }
    }

    run()
  }, [token, router])

  return (
    <div className="min-h-screen flex items-center justify-center">
      <div className="animate-spin w-8 h-8 border-4 border-blue-600 border-t-transparent rounded-full" />
    </div>
  )
}