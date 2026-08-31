import { gql } from '@apollo/client'

export const LOGIN_MUTATION = gql`
  mutation Login($email: String!, $password: String!) {
    login(email: $email, password: $password) {
      success
      error
      accessToken
    }
  }
`

export interface LoginMutationVariables {
  email: string
  password?: string
}

export interface LoginMutationResponse {
  login: {
    success: boolean
    error?: string
    accessToken?: string
  }
}

export type LoginMutationResult = LoginMutationResponse