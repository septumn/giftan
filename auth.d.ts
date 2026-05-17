import { type DefaultSession } from "next-auth"

declare module "next-auth" {
  interface Session {
    user: {
      id: string
      name: string
      bio?: string | null
      emailVerified?: Date | null
    } & DefaultSession["user"]
  }

  interface User {
    name: string
    bio?: string | null
    emailVerified?: Date | null
  }
}

declare module "next-auth/jwt" {
  interface JWT {
    id: string
    name: string
    bio?: string | null
    emailVerified?: Date | null
  }
}