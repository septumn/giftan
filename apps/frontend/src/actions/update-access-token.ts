import { getClient } from "@/lib/apollo/client"
import { UPDATE_ACCESS_TOKEN_MUTATION, UpdateAccessTokenMutationResponse } from "@/graphql/user/mutations/update-access-token"

export async function updateAccessToken(): Promise<{ success: boolean }> {
  const client = await getClient()

  const { data, error } = await client.mutate<UpdateAccessTokenMutationResponse>({
    mutation: UPDATE_ACCESS_TOKEN_MUTATION,
    fetchPolicy: 'no-cache',
    context: {
      fetchOptions: {
        cache: 'no-store'
      }
    }
  })


  if (!error && !data?.login.error) {
    return { success: true }
  }

  return { success: false }
}