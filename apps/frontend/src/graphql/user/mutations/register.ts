import { gql } from '@apollo/client'

export const REGISTER_MUTATION = gql`
  mutation Register($input: RegisterInputDto!) {
    register(input: $input) {
      success
      user
    }
  }
`

export interface RegisterMutationVariables {
  input: {
    name: string
    email: string
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