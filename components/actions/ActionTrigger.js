import { useState } from 'react'
import { useActionsContext } from './ActionsProvider'

export default function ActionTrigger({ triggerName }) {
  const { getActionsForTrigger } = useActionsContext()
  const actions = getActionsForTrigger(triggerName)

  return (
    <>
      <h3>{triggerName}</h3>
      {actions.map((action, index) => (
        <div key={index}>{action.name}</div>
      ))}
    </>
  )
}
