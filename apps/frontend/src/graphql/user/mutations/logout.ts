import { gql } from "@apollo/client"

export const LOGOUT_MUTATION = gql`
  mutation Logout {
    logout {
      success
      error
    }
  }
`

export interface LogoutMutationResult {
  success: boolean
  error?: string | null
}

export interface LogoutMutationResponse {
  logout: LogoutMutationResult
}