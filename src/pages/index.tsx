import {Box, Heading} from '@chakra-ui/react'
import type {NextPage} from 'next'
import Head from 'next/head'
import {Authenticate} from '../auth/context'
import {Data} from '../components/data'

const Home: NextPage = () => {
  return (
    <div>
      <Head>
        <title>Create Next App</title>
        <meta name="description" content="Generated by create next app" />
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <header>
        <Heading as="h1">Coordinape Playground</Heading>
      </header>

      <Box as="main" p={3}>
        <Authenticate>
          <Data />
        </Authenticate>
      </Box>
    </div>
  )
}

export default Home
