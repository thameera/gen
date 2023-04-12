import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogContentText,
  Button,
  FormControl,
  FormLabel,
  RadioGroup,
  FormControlLabel,
  Radio,
  DialogActions,
  Switch,
} from '@material-ui/core'
import { useState, useEffect } from 'react'
import axios from 'axios'

export default function ULPDialogButton({ tenantLabel }) {
  const [open, setOpen] = useState(false)
  const [status, setStatus] = useState('')
  const [experience, setExperience] = useState('')
  const [isCustomPage, setIsCustomPage] = useState(false)

  useEffect(() => {
    if (status !== 'Updated!') {
      return
    }
    setTimeout(() => {
      setStatus('')
    }, 1000)
  }, [status])

  const handleClickOpen = async () => {
    setOpen(true)
    setStatus('Fetching...')
    try {
      const res = await axios(
        `/api/mgmt/prompts/getPrompts?tenant=${tenantLabel}`
      )
      console.log(res.data)
      setExperience(res.data.universal_login_experience)
      setIsCustomPage(res.data.custom_login_page_on)
      setStatus('')
    } catch (e) {
      console.log(e)
      setStatus('Error fetching ULP Settings')
    }
  }

  const handleClose = () => {
    setOpen(false)
    setExperience('')
    setStatus('')
  }

  const handleUpdate = async () => {
    setStatus('Updating...')
    try {
      await axios.post('/api/mgmt/prompts/patchPrompts', {
        tenantLabel,
        universal_login_experience: experience,
        custom_login_page_on: isCustomPage,
      })
      setStatus('Updated!')
    } catch (e) {
      console.log(e)
      setStatus('Error updating ULP Settings')
    }
  }

  return (
    <>
      <Dialog open={open} onClose={handleClose} maxWidth="xs" fullWidth={true}>
        <DialogTitle>ULP Settings</DialogTitle>
        <DialogContent>
          {experience && (
            <>
              <div>
                <FormControl component="fieldset">
                  <FormLabel component="legend">ULP Experience</FormLabel>
                  <RadioGroup
                    value={experience}
                    onChange={(e) => setExperience(e.target.value)}
                  >
                    <FormControlLabel
                      value="classic"
                      control={<Radio />}
                      label="Classic"
                    />
                    <FormControlLabel
                      value="new"
                      control={<Radio />}
                      label="New"
                    />
                  </RadioGroup>
                </FormControl>
              </div>
              <div>
                <FormControlLabel
                  control={
                    <Switch
                      checked={isCustomPage}
                      onChange={(e) => setIsCustomPage(e.target.checked)}
                    />
                  }
                  label="Custom Login Page"
                />
              </div>
            </>
          )}
          {status && <DialogContentText>{status}</DialogContentText>}
        </DialogContent>
        <DialogActions>
          <Button onClick={handleUpdate} color="primary">
            Update
          </Button>
          <Button onClick={handleClose} color="secondary">
            Close
          </Button>
        </DialogActions>
      </Dialog>
      <Button variant="contained" color="primary" onClick={handleClickOpen}>
        ULP Settings
      </Button>
    </>
  )
}
