export interface CurrentUserPayload {
  id: string
  email: string | null
  name: string | null
  emailVerified: Date | null
}