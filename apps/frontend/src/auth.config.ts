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
    async jwt({ token, user, account, trigger, session }) {
      if (user) {
        token.id = user.id as string
        token.bio = (user as any).bio
        token.name = user.name
        token.image = user.image
        token.email = user.email
        token.role = (user as any).role || "USER"
        token.emailVerified = account?.provider === 'google' ? new Date() : user.emailVerified
      }

      if (trigger === "update" && session) {
        token = { ...token }
        if (session.user?.name) token.name = session.user.name
        if (session.user?.image) token.image = session.user.image
        if ("bio" in (session.user || {})) token.bio = session.user.bio
        if (session.user?.emailVerified) token.emailVerified = new Date(session.user.emailVerified)
      }

      return token
    },

    async session({ session, token }) {
      if (session.user && token.id) {
        session.user.id = token.id as string
        session.user.bio = token.bio as string | null
        session.user.name = token.name as string
        session.user.image = token.image as string | null
        session.user.role = token.role as string | null
        session.user.emailVerified = token.emailVerified as any
      }
      return session
    }
  }
} satisfies NextAuthConfig