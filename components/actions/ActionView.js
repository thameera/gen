import { makeStyles } from '@material-ui/core'
import { useActionsContext } from './ActionsProvider'
import CodeMirror from '@uiw/react-codemirror'
import { javascript } from '@codemirror/lang-javascript'
import { useEffect } from 'react'

const useStyles = makeStyles(() => ({
  root: {
    width: '100%',
    height: '100%',
  },
}))

export default function ActionView({ actionId, isVisible }) {
  const classes = useStyles()
  const {
    currentAction,
    updateAction,
    setCurrentActionById,
  } = useActionsContext()

  useEffect(() => {
    if (isVisible) {
      setCurrentActionById(actionId)
    }
  }, [isVisible])

  const onChange = (val) => {
    updateAction(actionId, val)
  }

  return (
    <div className={classes.root}>
      <CodeMirror
        value={currentAction ? currentAction.code : ''}
        height="65vh"
        width="700px"
        extensions={[javascript()]}
        onChange={onChange}
      />
    </div>
  )
}
