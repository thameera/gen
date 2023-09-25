import { Button } from '@material-ui/core'
import { useActionsContext } from './ActionsProvider'

export default function ActionView() {
  const { patchAction, status } = useActionsContext()

  if (status === '') return null

  const buttonData = {
    modified: { text: 'Update', disabled: false, color: 'primary' },
    patching: { text: 'Updating...', disabled: true, color: 'default' },
    deploying: { text: 'Deploying...', disabled: true, color: 'default' },
    deployed: { text: 'Deployed!', disabled: true, color: 'default' },
    error: { text: 'Error!', disabled: true, color: 'secondary' },
  }

  return (
    <Button
      onClick={patchAction}
      color={buttonData[status].color}
      disabled={buttonData[status].disabled}
    >
      {buttonData[status].text}
    </Button>
  )
}
