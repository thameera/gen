import axios from 'axios'
import { createContext, useContext, useEffect, useState } from 'react'

export const ActionsContext = createContext()

export const ActionsProvider = ({ tenant, children }) => {
  const [triggers, setTriggers] = useState([])

  useEffect(async () => {
    const res = await axios(`/api/mgmt/actions/getActions?tenant=${tenant}`)
    setTriggers(res.data)
  }, [])

  // For use by ActionTrigger.js
  const getActionsForTrigger = (triggerName) => {
    return triggers.find((trigger) => trigger.trigger === triggerName).actions
  }

  // For use by ActionView.js
  const getActionById = (actionId) => {
    for (const trigger of triggers) {
      for (const action of trigger.actions) {
        if (action.action_id === actionId) {
          return action
        }
      }
    }
  }

  return (
    <ActionsContext.Provider
      value={{ triggers, getActionsForTrigger, getActionById }}
    >
      {children}
    </ActionsContext.Provider>
  )
}

export const useActionsContext = () => {
  const context = useContext(ActionsContext)
  if (context === undefined) {
    throw new Error('useActionsContext must be used within a ActionsProvider')
  }
  return context
}
