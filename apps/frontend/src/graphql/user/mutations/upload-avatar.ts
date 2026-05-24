import { gql } from "@apollo/client"

export const UPLOAD_AVATAR_MUTATION = gql`
  mutation UpdateAvatar($image: String) {
    uploadAvatar(image: $image) { id image }
  }
`