import {Stack} from '@chakra-ui/react'
import axios from 'axios'
import {useEffect} from 'react'
import {useQuery} from 'react-query'
import {useAuthContext} from '../auth/context'
import {Tables} from '../tables/tables'

const useCircleSnapshot = () => {
  const {token, clear} = useAuthContext()

  const query = useQuery('circleSnapshot', async () => {
    const params = new URLSearchParams({token: token || ''})
    const response = await axios.get(`/api/snapshot?${params}`)
    return response.data
  })

  // if we receive a 401, clear the token so we can force re-authentication
  useEffect(() => {
    if ((query.error as any)?.response?.status === 401) {
      clear()
    }
  }, [query.error, clear])

  return query
}

export const Data = () => {
  const {isLoading, error, data} = useCircleSnapshot()

  return (
    <div>
      {isLoading && <p>Loading...</p>}
      {error && <p>Error: {(error as any).message}</p>}
      {data && (
        <Stack>
          <Tables {...data} />
        </Stack>
      )}
    </div>
  )
}
