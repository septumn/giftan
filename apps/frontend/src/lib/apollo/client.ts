import { ApolloClient, InMemoryCache, HttpLink } from '@apollo/client'
import { registerApolloClient } from '@apollo/experimental-nextjs-app-support/rsc'

export const { getClient } = registerApolloClient(async () => {
  return new ApolloClient({
    cache: new InMemoryCache(),
    link: new HttpLink({
      uri: 'http://backend:3001/graphql',
    }),
  })
})

export function getMutationClient(token?: string) {
  return new ApolloClient({
    cache: new InMemoryCache(),
    link: new HttpLink({
      uri: 'http://backend:3001/graphql',
      headers: {
        ...(token ? { Authorization: `Bearer ${token}` } : {}),
      },
    }),
  })
}