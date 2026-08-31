import { ApolloClient, InMemoryCache, HttpLink } from '@apollo/client'
import { registerApolloClient } from '@apollo/experimental-nextjs-app-support/rsc'
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
