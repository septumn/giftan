"use client"

import { useEffect, useRef } from "react"
import { useSession } from "next-auth/react"
import { useRouter } from "next/navigation"

export default function SessionUpdater({ redirectPath }: { redirectPath?: string }) {
  const { data: session, update, status } = useSession()
  const router = useRouter()
  const executed = useRef(false)

  useEffect(() => {
    if (status === "loading" || executed.current) return

    const run = async () => {
      executed.current = true
      await update()
      await new Promise(res => setTimeout(res, 600))
      if (redirectPath) {
        window.location.replace(redirectPath)
      } else {
        router.refresh()
      }
    }
    run()
  }, [update, redirectPath, router, status])

  return null
}