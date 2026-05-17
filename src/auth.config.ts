import Google from "next-auth/providers/google"
import type { NextAuthConfig } from "next-auth"

export default {
  providers: [
    Google({
      clientId: process.env.GOOGLE_CLIENT_ID,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET,
      authorization: {
        params: {
          prompt: "select_account",
          access_type: "offline",
          response_type: "code",
        },
      },
    }),
  ],
  callbacks: {
    async jwt({ token, user, trigger }) {
      if (user) {
        token.id = user.id
        token.bio = (user as any).bio
        token.name = (user as any).name
        token.emailVerified = (user as any).emailVerified
        token.image = (user as any).image
      }

      return token
    },
    async session({ session, token }) {
      if (session.user) {
        session.user.id = token.id as string
        session.user.bio = token.bio as string
        session.user.emailVerified = token.emailVerified as any
        session.user.name = token.name as string
        session.user.image = token.image as string
      }

      return session
    },
  },
} satisfies NextAuthConfig