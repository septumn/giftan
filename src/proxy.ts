import NextAuth from "next-auth"
import authConfig from "./auth.config"
import { NextResponse } from "next/server"

const { auth } = NextAuth(authConfig)

export default auth((req) => {
  const isLoggedIn = !!req.auth
  const isVerified = !!req.auth?.user?.emailVerified
  const { pathname } = req.nextUrl

  if (isLoggedIn && isVerified && (pathname.startsWith('/auth'))) {
    return NextResponse.redirect(new URL('/profile', req.url))
  }

  if (isLoggedIn && !isVerified && (pathname === '/profile' || pathname === '/auth')) {
    return NextResponse.redirect(new URL('/auth/verification', req.url))
  }

  if (!isLoggedIn && !isVerified && (pathname === '/profile' || pathname === '/auth/verification')) {
    return NextResponse.redirect(new URL('/auth', req.url))
  }

  return NextResponse.next()
})

export const config = {
  matcher: ["/((?!api|_next/static|_next/image|favicon.ico).*)"],
}