import { gql } from '@apollo/client'

export const REGISTER_MUTATION = gql`
  mutation Register($input: RegisterInputDto!) {
    register(input: $input) {
      __typename
      ... on RegistrationSuccessResponseDto {
        success
        user {
          id
          name
          email
          emailVerified
          role
        }
      }
      ... on RegistrationErrorResponseDto {
        success
        error {
          code
          message
        }
      }
    }
  }
`

export interface RegisterMutationVariables {
  input: {
    email: string
    name: string
    password?: string
  }
}

export interface RegisterMutationResponse {
  register: {
    success: boolean
    user: any
  }
}

export type RegisterMutationResult = RegisterMutationResponse