import { useState } from 'react'
import Head from 'next/head'
import { Container, Box, makeStyles } from '@material-ui/core'

import GenButtons from '../components/GenButtons'
import StrategyEditor from '../components/StrategyEditor'
import TenantSelector from '../components/TenantSelector'

const useStyles = makeStyles(() => ({
  tenantSelector: {
    marginBottom: '20px',
    padding: '20px',
    border: '1px solid',
    borderColor: '#ddd',
    borderRadius: 10,
  },
}))

export default function Home() {
  const [env, setEnv] = useState({})
  const [strategy, setStrategy] = useState({})
  const classes = useStyles()

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
      <Box className={classes.tenantSelector}>
        <TenantSelector onUpdate={(env) => setEnv(env)} />
      </Box>
      <Box>
        <StrategyEditor onUpdate={(s) => setStrategy(s)} />
      </Box>
      <Box>
        <GenButtons strategy={strategy} env={env} />
      </Box>
    </Container>
  )
}
