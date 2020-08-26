import { useState } from 'react'
import Head from 'next/head'
import { Container, Box } from '@material-ui/core'

import GenButtons from '../components/GenButtons'
import StrategyEditor from '../components/StrategyEditor'

import styles from '../styles/Home.module.css'

export default function Home() {
  const [strategy, setStrategy] = useState({})

  return (
    <Container>
      <Head>
        <title>Flow generator</title>
        <link rel="icon" href="/favicon.ico" />
        <link
          rel="stylesheet"
          href="https://fonts.googleapis.com/css?family=Roboto:300,400,500,700&display=swap"
        />
        <link
          rel="stylesheet"
          href="https://fonts.googleapis.com/icon?family=Material+Icons"
        />
      </Head>

      <Box>
        <h1>Gen</h1>
      </Box>
      <Box>
        <StrategyEditor onUpdate={(s) => setStrategy(s)} />
      </Box>
      <Box>
        <GenButtons strategy={strategy} />
      </Box>
    </Container>
  )
}
