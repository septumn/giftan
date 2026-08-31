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

<<<<<<< HEAD
  // if (isLoggedIn && !isVerified && (pathname === '/profile' || pathname === '/auth')) {
  //   return NextResponse.redirect(new URL('/auth/verification', req.url))
  // }

  // if ((!isLoggedIn || !isVerified) && pathname === '/profile') {
  //   return NextResponse.redirect(new URL('/auth', req.url))
  // }
=======
  if (isLoggedIn && !isVerified && (pathname === '/profile' || pathname === '/auth')) {
    return NextResponse.redirect(new URL('/auth/verification', req.url))
  }

  if ((!isLoggedIn || !isVerified) && pathname === '/profile') {
    return NextResponse.redirect(new URL('/auth', req.url))
  }
>>>>>>> a425819849e63eecfc5a85d7a32df2390ec1cc78

  return NextResponse.next()
})

export const config = {
  matcher: ["/((?!api|_next/static|_next/image|favicon.ico).*)"],
}