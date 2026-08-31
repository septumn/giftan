import { gql } from "@apollo/client"

export const REMOVE_FROM_BLACKLIST = gql`
  mutation RemoveFromBlacklist ($userId: String!) {
    removeFromBlacklist(userId: $userId) {
      success, error
    }
  }
`