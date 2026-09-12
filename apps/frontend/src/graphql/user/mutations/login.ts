import { gql } from '@apollo/client'
import { LoginInput } from '@giftan/shared/auth/login/contract'

export const LOGIN_MUTATION = gql`
  mutation Login($input: LoginInputDto!) {
    login(input: $input) {
      success
      error
      accessToken
    }
  }
`

export interface LoginMutationVariables {
  input: LoginInput
}

export interface LoginMutationResponse {
  login: {
    success: boolean
    error?: string
    accessToken?: string
  }
}

export type LoginMutationResult = LoginMutationResponse