import { type DefaultSession } from "next-auth"

declare module "next-auth" {
  interface Session {
    user: {
      id: string
      name?: string | null
      email?: string | null
      image?: string | null
      bio?: string | null
      emailVerified?: Date | null
      role?: string | null
    } & DefaultSession["user"]
  }

  interface User {
    name: string
    bio?: string | null
    emailVerified?: Date | null
    role?: string | null
    password?: string | null
  }
}

declare module "next-auth/jwt" {
  interface JWT {
    id: string
    name: string
    bio?: string | null
    role?: string | null
    emailVerified?: Date | null
  }
}