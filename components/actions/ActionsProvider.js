import axios from 'axios'
import { createContext, useContext, useEffect, useState } from 'react'

export const ActionsContext = createContext()

export const ActionsProvider = ({ tenant, children }) => {
  const [triggers, setTriggers] = useState([])

  useEffect(async () => {
    const res = await axios(`/api/mgmt/actions/getActions?tenant=${tenant}`)
    setTriggers(res.data)
  }, [])

  return (
    <ActionsContext.Provider value={{ triggers }}>
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
