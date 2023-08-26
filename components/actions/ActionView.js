import { makeStyles } from '@material-ui/core'
import { useActionsContext } from './ActionsProvider'

const useStyles = makeStyles(() => ({
  root: {
    width: '100%',
    height: '100%',
  },
  textarea: {
    width: '100%',
    height: '100%',
  },
}))

export default function ActionView({ actionId }) {
  const classes = useStyles()

  const { getActionById } = useActionsContext()
  const action = getActionById(actionId)

  return (
    <div className={classes.root}>
      <textarea className={classes.textarea} value={action.code} readOnly />
    </div>
  )
}
