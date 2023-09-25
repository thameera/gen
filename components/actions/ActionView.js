import { makeStyles } from '@material-ui/core'
import { useActionsContext } from './ActionsProvider'
import CodeMirror from '@uiw/react-codemirror'
import { javascript } from '@codemirror/lang-javascript'

const useStyles = makeStyles(() => ({
  root: {
    width: '100%',
    height: '100%',
  },
}))

export default function ActionView({ actionId }) {
  const classes = useStyles()

  const { getActionById, updateAction } = useActionsContext()
  const action = getActionById(actionId)

  const onChange = (val) => {
    updateAction(actionId, val)
  }

  return (
    <div className={classes.root}>
      <CodeMirror
        value={action.code}
        height="65vh"
        width="700px"
        extensions={[javascript()]}
        onChange={onChange}
      />
    </div>
  )
}
