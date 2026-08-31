'use server'

import { getClient } from '@/lib/apollo/client'
import { USER_DATA_QUERY, UserDataQueryResponse } from '@/graphql/user/queries/user-data'

export type UserData = UserDataQueryResponse['me']

export const getUserData = async () => {
  const client = await getClient()

  console.log('Отправляю запрос на данные пользователя')
  try {
    const { data, error } = await client.query<UserDataQueryResponse>({
      query: USER_DATA_QUERY,
      fetchPolicy: 'no-cache',
      context: {
        fetchOptions: {
          cache: 'no-store'
        }
      }
    })

    return data?.me || null
  } catch (error) {
    console.log('Не удалось получить данные пользователя', error)
    return null
  }
}