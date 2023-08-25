import {
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
} from '@material-ui/core'
import { useState } from 'react'
import { ActionsProvider } from '../actions/ActionsProvider'
import ActionTriggersList from '../actions/ActionTriggersList'

export default function ActionsDialogButton({ tenantLabel }) {
  const [open, setOpen] = useState(false)

  /*
   * Open dialog
   */
  const handleClickOpen = async () => {
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
      <Dialog open={open} onClose={handleClose} maxWidth="lg" fullWidth={true}>
        <DialogTitle>Actions</DialogTitle>

        <DialogContent>
          <ActionsProvider tenant={tenantLabel}>
            <ActionTriggersList />
          </ActionsProvider>
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
