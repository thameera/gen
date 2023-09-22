import {
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  makeStyles,
} from '@material-ui/core'
import { useState } from 'react'
import ActionTriggersList from '../actions/ActionTriggersList'
import { useActionsContext } from '../actions/ActionsProvider'

const useStyles = makeStyles(() => ({
  paper: {
    minHeight: '80vh',
    maxHeight: '80vh',
  },
}))

export default function ActionsDialogButton({ tenantLabel }) {
  const classes = useStyles()
  const { initialize } = useActionsContext()

  const [open, setOpen] = useState(false)

  /*
   * Open dialog
   */
  const handleClickOpen = async () => {
    // Fetch actions for this tenant
    initialize(tenantLabel)
    setOpen(true)
  }

  /*
   * Close dialog
   */
  const handleClose = () => {
    setOpen(false)
  }

  return (
    <>
      <Dialog
        open={open}
        onClose={handleClose}
        maxWidth="lg"
        fullWidth={true}
        classes={{ paper: classes.paper }}
      >
        <DialogTitle>Actions</DialogTitle>

        <DialogContent>
          <ActionTriggersList />
        </DialogContent>

        <DialogActions>
          <Button onClick={handleClose} color="secondary">
            Close
          </Button>
        </DialogActions>
      </Dialog>

      <Button variant="contained" color="primary" onClick={handleClickOpen}>
        Actions
      </Button>
    </>
  )
}
