import { Tab, Tabs, makeStyles } from '@material-ui/core'
import { useActionsContext } from './ActionsProvider'
import { useState } from 'react'
import ActionTrigger from './ActionTrigger'

const useStyles = makeStyles(() => ({
  root: {
    flexGrow: 1,
    display: 'flex',
  },
  tabs: {
    borderRight: `1px solid #ccc`,
  },
}))

export default function ActionTriggersList() {
  const classes = useStyles()

  const [selectedTab, setSelectedTab] = useState(0)

  const { triggers } = useActionsContext()
  console.log(triggers)

  const handleChange = (ev, newValue) => {
    setSelectedTab(newValue)
  }

  return (
    <div class={classes.root}>
      <Tabs
        value={selectedTab}
        onChange={handleChange}
        orientation="vertical"
        class={classes.tabs}
      >
        {triggers.map((trigger, index) => (
          <Tab label={trigger.trigger} key={index} />
        ))}
      </Tabs>

      {triggers.map((trigger, index) => (
        <div key={index} hidden={selectedTab !== index}>
          <ActionTrigger triggerName={trigger.trigger} key={index} />
        </div>
      ))}
    </div>
  )
}
