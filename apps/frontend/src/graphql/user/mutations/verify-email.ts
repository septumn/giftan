import { gql } from "@apollo/client"

export const VERIFY_MUTATION = gql`
  mutation VerifyEmail($token: String!) {
    verifyEmail(token: $token) {
      success
      emailVerified
      error
    }
  }
`
export interface VerifyEmailMutationVariables {
  token: string
}

export interface VerifyEmailMutationResult {
  success: boolean
  emailVerified: string | null
  error?: string
}

export interface VerifyEmailMutationResponse {
  verifyEmail: VerifyEmailMutationResult
}