import { gql } from "@apollo/client"

export const LEGIT_CHECK_QUERY = gql`
  query LegitCheck {
    legitCheck
  }
`