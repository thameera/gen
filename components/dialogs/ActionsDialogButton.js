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
import ActionUpateButton from '../actions/ActionUpdateButton'
import { useActionsContext } from '../actions/ActionsProvider'

const useStyles = makeStyles(() => ({
  paper: {
    minHeight: '80vh',
    maxHeight: '80vh',
  },
}))

export default function ActionsDialogButton({ tenantLabel }) {
  const classes = useStyles()
  const { initialize, getManageUrl } = useActionsContext()

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

  /*
   * Open Action in manage
   */
  const handleManage = () => {
    window.open(getManageUrl(), '_blank')
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
          <ActionUpateButton />
          <Button onClick={handleManage} color="default">
            {'\u2197'} Manage
          </Button>
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
