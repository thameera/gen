import { useState } from 'react'
import { useActionsContext } from './ActionsProvider'
import { Tab, Tabs, makeStyles } from '@material-ui/core'
import ActionView from './ActionView'

const useStyles = makeStyles(() => ({
  root: {
    flexGrow: 1,
    display: 'flex',
    height: '100%',
  },
  tabs: {
    borderRight: `1px solid #ccc`,
    minWidth: '200px',
    maxWidth: '200px',
  },
}))

export default function ActionTrigger({ triggerName }) {
  const classes = useStyles()

  const [selectedTab, setSelectedTab] = useState(0)

  const { getActionsForTrigger } = useActionsContext()
  const actions = getActionsForTrigger(triggerName)

  const handleChange = (ev, newValue) => {
    setSelectedTab(newValue)
  }

  return (
    <div className={classes.root}>
      <Tabs
        value={selectedTab}
        onChange={handleChange}
        orientation="vertical"
        className={classes.tabs}
      >
        {actions.map((action, index) => (
          <Tab key={index} label={action.name} />
        ))}
      </Tabs>

      {actions.map((action, index) => (
        <div key={index} hidden={selectedTab !== index}>
          <ActionView actionId={action.action_id} />
        </div>
      ))}
    </div>
  )
}
