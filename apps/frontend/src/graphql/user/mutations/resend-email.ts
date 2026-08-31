import { gql } from "@apollo/client"

export const RESEND_EMAIL_MUTATION = gql`
  mutation ResendVerification($email: String!) {
    resendVerificationEmail(email: $email) {
      success
      error
    }
  }
`

export interface ResendEmailMutationVariables {
  email: string
}

export interface ResendEmailMutationResult {
  success: boolean
  error?: string
}

export interface ResendEmailMutationResponse {
  resendVerificationEmail: ResendEmailMutationResult
}