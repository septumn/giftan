import NextAuth from "next-auth"
import Credentials from "next-auth/providers/credentials"
import { compare } from "bcrypt-ts"
import { db } from "@/db"
import { users, accounts, sessions, verificationTokens } from "@/db/schema"
import { DrizzleAdapter } from "@auth/drizzle-adapter"
import { eq } from 'drizzle-orm'
import Nodemailer from "next-auth/providers/nodemailer"
import authConfig from "./auth.config"

export const { handlers, signIn, signOut, auth, unstable_update } = NextAuth({
  adapter: DrizzleAdapter(db, {
    usersTable: users,
    accountsTable: accounts,
    sessionsTable: sessions,
    verificationTokensTable: verificationTokens
  }),
  session: { strategy: "jwt" },
  ...authConfig,
  providers: [
    ...authConfig.providers,
    Nodemailer({
      server: {
        host: "smtp.gmail.com",
        port: 465,
        secure: true,
        auth: {
          user: process.env.EMAIL_SERVER_USER,
          pass: process.env.EMAIL_SERVER_PASSWORD,
        },
      },
      from: process.env.EMAIL_FROM
    }),
    Credentials({
      async authorize(credentials) {
        const email = credentials?.email as string
        const password = credentials?.password as string

        if (!email || !password) return null

        const [user] = await db
          .select()
          .from(users)
          .where(eq(users.email, email))

        if (!user || !user.password) return null

        const isPasswordValid = await compare(password, user.password)
        if (!isPasswordValid) return null

        return {
          id: user.id,
          name: user.name,
          bio: user.bio,
          emailVerified: user.emailVerified,
          image: user.image,
        }
      }
    })
  ],
  callbacks: {
    ...authConfig.callbacks,
    async signIn({ user, account }) {
      if (account?.provider === 'nodemailer' || account?.provider === 'credentials') return true
      const [existingUser] = await db
        .select({ id: users.id })
        .from(users)
        .where(eq(users.id, user.id))

      return !!existingUser
    },
    async jwt(params) {
      const { trigger, session } = params

      let token = (await authConfig.callbacks?.jwt?.(params) || params.token)

      if (trigger === "update" && token.id) {
        const [user] = await db
          .select({
            image: users.image,
            emailVerified: users.emailVerified,
            name: users.name,
            bio: users.bio,
          })
          .from(users)
          .where(eq(users.id, token.id as string))

        if (user) {
          token = { ...token }

          token.image = user.image;
          if (session?.user?.emailVerified) token.emailVerified = user.emailVerified;
          if (session?.user?.name) token.name = user.name;
          token.bio = user.bio;
        }
      }
      return token
    },
  },
  pages: {
    newUser: "/auth/set-name",
    error: '/auth',
  },
})