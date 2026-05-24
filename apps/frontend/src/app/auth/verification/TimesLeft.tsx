"use client"

import { useState, useEffect } from "react"

const TimesLeft = ({ expiresAt }) => {
  const [timeLeft, setTimeLeft] = useState('00:00')

  useEffect(() => {
    const expiryTimestamp = new Date(expiresAt).getTime()

    if (isNaN(expiryTimestamp)) return

    const updateTimer = () => {
      const now = Date.now()
      const diff = expiryTimestamp - now

      if (diff <= 0) {
        setTimeLeft('00:00')
        return
      }

      const minutes = Math.floor(diff / 60000)
      const seconds = Math.floor((diff % 60000) / 1000)

      setTimeLeft(
        `${String(minutes).padStart(2, '0')}:${String(seconds).padStart(2, '0')}`
      )
    }

    updateTimer()
    const interval = setInterval(updateTimer, 1000)

    return () => clearInterval(interval)
  }, [expiresAt])

  return <span>Осталось: {timeLeft}</span>
}

export default TimesLeft