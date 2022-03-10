import {Heading} from '@chakra-ui/react'
import type {NextPage} from 'next'
import Head from 'next/head'
import {useQuery} from 'react-query'

const useCircleSnapshot = () =>
  useQuery('circleSnapshot', async () => {
    const response = await fetch('/api/snapshot')

    if (response.status >= 400) {
      throw new Error(await response.json())
    }

    return await response.json()
  })

const Home: NextPage = () => {
  const {isLoading, error, data} = useCircleSnapshot()

  return (
    <div>
      <Head>
        <title>Create Next App</title>
        <meta name="description" content="Generated by create next app" />
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <main>
        <Heading as="h1">Coordinape Playground</Heading>

        <div>
          {isLoading && <p>Loading...</p>}
          {error && <p>Error: {(error as any).message}</p>}
          {data && <pre>{JSON.stringify(data)}</pre>}
        </div>
      </main>
    </div>
  )
}

export default Home
