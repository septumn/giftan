import { gql } from "@apollo/client"

export const LOGIN_QUERY = gql`
  query ValidateUser($email: String!, $password: String!) {
    validateUser(email: $email, password: $password) {
      id name email bio image role isBlocked emailVerified
    }
  }
`