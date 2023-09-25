import { Button } from '@material-ui/core'
import { useActionsContext } from './ActionsProvider'

export default function ActionView() {
  const { isModified } = useActionsContext()

  const handleUpdate = () => {}

  if (!isModified) return null

  return (
    <Button onClick={handleUpdate} color="primary">
      Update
    </Button>
  )
}
