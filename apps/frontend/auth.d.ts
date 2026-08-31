import { type DefaultSession } from "next-auth"

declare module "next-auth" {
  interface Session {
    user: {
      id: string
<<<<<<< HEAD
      name?: string | null
      email?: string | null
      image?: string | null
      bio?: string | null
      emailVerified?: Date | null
      role?: string | null
=======
      name: string
      bio?: string | null
      emailVerified?: Date | null
>>>>>>> a425819849e63eecfc5a85d7a32df2390ec1cc78
    } & DefaultSession["user"]
  }

  interface User {
    name: string
    bio?: string | null
    emailVerified?: Date | null
<<<<<<< HEAD
    role?: string | null
=======
>>>>>>> a425819849e63eecfc5a85d7a32df2390ec1cc78
    password?: string | null
  }
}

declare module "next-auth/jwt" {
  interface JWT {
    id: string
    name: string
    bio?: string | null
<<<<<<< HEAD
    role?: string | null
=======
>>>>>>> a425819849e63eecfc5a85d7a32df2390ec1cc78
    emailVerified?: Date | null
  }
}