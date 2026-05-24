"use client"

import { Toaster as SonnerToaster } from "sonner"

const Toaster = () => {
  return (
    <SonnerToaster
      position="top-right"
      richColors
      expand={false}
      duration={3000}
      closeButton
      theme="light"
    />
  )
}

export default Toaster