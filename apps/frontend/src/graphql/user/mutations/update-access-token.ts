import { gql } from '@apollo/client'

export const UPDATE_ACCESS_TOKEN_MUTATION = gql`
  mutation UpdateAccessToken() {
    updateAccessToken() {
      success
      error
      accessToken
    }
  }
`

export interface UpdateAccessTokenMutationResponse {
  login: {
    success: boolean
    error?: string
    accessToken?: string
  }
}

export type UpdateAccessTokenMutationResult = UpdateAccessTokenMutationResponse