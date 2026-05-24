import NextAuth from "next-auth"
import Credentials from "next-auth/providers/credentials"
import Nodemailer from "next-auth/providers/nodemailer"
import { db } from "@/db"
import { users, accounts, sessions, verificationTokens } from "@/db/schema"
import { DrizzleAdapter } from "@auth/drizzle-adapter"
import { eq } from 'drizzle-orm'
import authConfig from "@/auth.config"

const NEST_GRAPHQL_URL = 'http://backend:3001/graphql'

declare module "next-auth" {
  interface User {
    bio?: string | null
    emailVerified?: Date | null
    role?: string | null
  }
  interface Session {
    user: {
      id: string
      name?: string | null
      email?: string | null
      image?: string | null
      bio?: string | null
      emailVerified?: Date | null
      role?: string | null
    }
  }
}

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
        host: "://gmail.com",
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
      credentials: {
        email: { label: "Email", type: "email" },
        password: { label: "Password", type: "password" }
      },
      async authorize(credentials) {
        if (!credentials) return null;

        const creds = credentials as Record<string, unknown>;
        const email = typeof creds.email === 'string' ? creds.email.trim().toLowerCase() : '';
        const password = typeof creds.password === 'string' ? creds.password : '';

        if (!email || !password) return null;

        const VALIDATE_USER_QUERY = `
          query ValidateUser($email: String!, $password: String!) {
            validateUser(email: $email, password: $password) {
              id name email bio image role isBlocked emailVerified
            }
          }
        `;

        try {
          const res = await fetch(NEST_GRAPHQL_URL, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
              query: VALIDATE_USER_QUERY,
              variables: { email, password }
            }),
          });

          const { data, errors } = await res.json();

          if (errors && errors.length > 0) return null;
          if (data?.validateUser?.isBlocked) return null;

          if (data?.validateUser) {
            const user = data.validateUser;
            return {
              id: user.id,
              name: user.name,
              email: user.email,
              bio: user.bio,
              image: user.image,
              role: user.role,
              emailVerified: user.emailVerified ? new Date(user.emailVerified) : null
            };
          }
        } catch (error) {
          console.error('[Auth.js authorize Error]:', error);
        }
        return null;
      }
    })
  ],

  events: {
    async createUser({ user }: { user: any }) {
      if (user.id && !user.password) {
        await db.update(users).set({ emailVerified: new Date() }).where(eq(users.id, user.id))
      }
    },
    async linkAccount({ user, account }) {
      if (account.provider === "google" && user.id) {
        await db.update(users).set({ emailVerified: new Date() }).where(eq(users.id, user.id));
      }
    },
    async signIn({ user }) {
      if (user && user.id) {
        try {
          await fetch(NEST_GRAPHQL_URL, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
              query: `mutation RemoveBan($userId: String!) { refreshSession(userId: $userId) { success } }`,
              variables: { userId: user.id }
            }),
          });
        } catch (error) {
          console.error('[Auth.js event Error] Не удалось отправить сигнал разбана:', error);
        }
      }
    }
  },

  callbacks: {
    async signIn({ user, account }: { user: any; account?: any }) {
      if (
        account?.provider === 'nodemailer' ||
        account?.provider === 'credentials' ||
        account?.provider === 'google'
      ) {
        return true
      }
      if (!user || !user.id) return false
      const [existingUser] = await db.select({ id: users.id }).from(users).where(eq(users.id, user.id))
      return !!existingUser
    },

    async jwt({ token, user, account, trigger, session }) {
      let currentToken = token
      if (user) {
        currentToken.id = user.id as string
        currentToken.bio = (user as any).bio
        currentToken.name = user.name
        currentToken.image = user.image
        currentToken.email = user.email
        currentToken.role = (user as any).role || "USER"
        currentToken.emailVerified = account?.provider === 'google' ? new Date() : user.emailVerified
      }

      if (currentToken.id) {
        currentToken.sub = currentToken.id as string
      }

      if (trigger === "update" && typeof currentToken.id === "string") {
        const [dbUser] = await db
          .select({
            image: users.image,
            emailVerified: users.emailVerified,
            name: users.name,
            bio: users.bio,
            role: users.role,
          })
          .from(users)
          .where(eq(users.id, currentToken.id))

        if (dbUser) {
          currentToken = { ...currentToken }
          currentToken.image = dbUser.image;
          currentToken.bio = dbUser.bio;
          currentToken.role = dbUser.role;
          if (session?.user?.name) currentToken.name = dbUser.name as string;
          if (session?.user?.emailVerified) currentToken.emailVerified = dbUser.emailVerified;
        }
        return currentToken;
      }

      if (trigger === "update" && session) {
        currentToken = { ...currentToken }
        if (session.user?.name) currentToken.name = session.user.name
        if (session.user?.image) currentToken.image = session.user.image
        if ("bio" in (session.user || {})) {
          const cleanBio = typeof session.user.bio === "string" ? session.user.bio.trim() : "";
          currentToken.bio = cleanBio === "" ? null : session.user.bio;
        }
        if (session.user?.emailVerified) currentToken.emailVerified = new Date(session.user.emailVerified)
      }

      return currentToken
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
  },

  pages: {
    newUser: "/auth/set-name",
    error: '/auth',
  },
})