export type UserRole = 'USER' | 'MODERATOR' | 'ADMIN'

export interface UserType {
  id: string
  name: string | null
  email: string | null
  emailVerified?: string | null
  role: UserRole
  image?: string | null
  bio?: string | null
}