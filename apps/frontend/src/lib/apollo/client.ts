import { ApolloClient, InMemoryCache, HttpLink } from '@apollo/client'
import { registerApolloClient } from '@apollo/experimental-nextjs-app-support/rsc'
<<<<<<< HEAD
import { cookies } from 'next/headers'

export const { getClient } = registerApolloClient(async () => {
  const cookieStore = await cookies()
  const token = cookieStore.get('access_token')?.value
  const isServer = typeof window === 'undefined'

  return new ApolloClient({
    cache: new InMemoryCache(),
    link: new HttpLink({
      uri: isServer
        ? process.env.NEST_GRAPHQL_URL
        : process.env.NEXT_PUBLIC_API_URL,
      headers: {
        ...(token ? { Authorization: `Bearer ${token}` } : {}),
      }
    }),
  });
})
=======

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
>>>>>>> a425819849e63eecfc5a85d7a32df2390ec1cc78
