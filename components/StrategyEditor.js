import strategies from '../lib/strategies'
import { FormControl, Box, TextField } from '@material-ui/core'
import { useState, useEffect } from 'react'
import { loadGetInitialProps } from 'next/dist/next-server/lib/utils'

export default function StrategyEditor({ onUpdate }) {
  const [strategyName, setStrategyName] = useState('auth0js-implicit')
  const strategy = strategies[strategyName]

  const vars = strategy.variables
  const [scope, setScope] = useState(vars.scope ? vars.scope : null)

  useEffect(() => {
    const s = {
      name: strategyName,
    }
    if (vars.scope) {
      s.scope = scope
    }
    onUpdate(s)
  }, [strategyName, scope])

  return (
    <>
      {scope && (
        <FormControl>
          <TextField
            id="scope"
            value={scope}
            label="Scope"
            variant="outlined"
            onChange={(e) => setScope(e.target.value)}
          />
        </FormControl>
      )}
    </>
  )
}
