import { gql } from "@apollo/client"

export const USER_DATA_QUERY = gql`
  query GetMe {
    me {
      id
      name
      email
      bio
      image
    }
  }
`

export interface UserDataQueryResponse {
  me: {
    id: string
    name: string
    email: string
    bio?: string
    image?: string
  } | null
}