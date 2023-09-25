import axios from 'axios'
import { createContext, useContext, useState } from 'react'

export const ActionsContext = createContext()

export const ActionsProvider = ({ children }) => {
  const [triggers, setTriggers] = useState([])
  const [currentTenant, setCurrentTenant] = useState('')
  const [currentAction, setCurrentAction] = useState({})
  const [isModified, setIsModified] = useState(false)

  const initialize = async (tenant) => {
    // Don't reload if we fetched actions for this tenant before
    if (tenant === currentTenant) {
      return
    }

    const res = await axios(`/api/mgmt/actions/getActions?tenant=${tenant}`)

    // Enrich actions
    const triggers = res.data.map((t) => {
      const actions = t.actions.map((a) => {
        return {
          ...a,
          origCode: a.code,
        }
      })
      return {
        ...t,
        actions,
      }
    })

    setTriggers(triggers)
    setCurrentTenant(tenant)
    setCurrentAction(triggers[0].actions[0] || {})
    console.log('Fetched actions: ', triggers)
  }

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

  // Updates the in-memory action only
  const updateAction = (actionId, newCode) => {
    // This check is probably not needed, but just in case
    if (currentAction.action_id !== actionId) {
      console.log(currentAction)
      throw new Error('Action ID mismatch')
    }

    currentAction.code = newCode
    setCurrentAction(currentAction)
    setTriggers(triggers)
    setIsModified(currentAction.code !== currentAction.origCode)
  }

  // To be called by ActionView when it becomes visible
  const setCurrentActionById = (actionId) => {
    const action = getActionById(actionId)
    if (action) {
      setCurrentAction(action)
      setIsModified(action.code !== action.origCode)
    }
  }

  return (
    <ActionsContext.Provider
      value={{
        triggers,
        initialize,
        getActionsForTrigger,
        updateAction,
        setCurrentActionById,
        currentAction,
        isModified,
      }}
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
