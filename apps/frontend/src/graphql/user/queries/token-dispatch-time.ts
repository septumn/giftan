import { gql } from "@apollo/client"

export const TOKEN_DISPATCH_TIME_QUERY = gql`
  query GetTokenDispatchTime ($email: String!) {
    getTokenDispatchTime(email: $email)
  }
`