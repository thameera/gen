import strategies from '../lib/strategies'
import { useState, useEffect } from 'react'

export default function StrategyEditor({ onUpdate }) {
  const [strategyName, setStrategyName] = useState('auth0js-implicit')
  const strategy = strategies[strategyName]

  useEffect(() => {
    const s = {
      name: strategyName,
    }
    onUpdate(s)
  }, [strategyName])

  return <>Strategy Editor</>
}
