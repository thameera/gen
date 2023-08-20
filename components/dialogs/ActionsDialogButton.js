import {
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
} from '@material-ui/core'
import { useState } from 'react'

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
      <Dialog open={open} onClose={handleClose} maxWidth="sm" fullWidth={true}>
        <DialogTitle>Actions</DialogTitle>

        <DialogContent>{tenantLabel}</DialogContent>

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
