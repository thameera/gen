import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogContentText,
  Button,
  FormControl,
  FormLabel,
  Grid,
  RadioGroup,
  FormControlLabel,
  Radio,
  DialogActions,
  Switch,
  IconButton,
} from '@material-ui/core'
import { useState, useEffect } from 'react'
import axios from 'axios'
import RefreshIcon from '@material-ui/icons/Refresh'

export default function ULPDialogButton({ tenantLabel }) {
  const [open, setOpen] = useState(false)
  const [status, setStatus] = useState('')
  const [currentTenant, setCurrentTenant] = useState('')
  const [experience, setExperience] = useState('')
  const [isCustomPage, setIsCustomPage] = useState(false)
  const [isIdFirst, setIsIdFirst] = useState(false)
  const [isWebauthnFirstFactor, setIsWebauthnFirstFactor] = useState(false)
  const [authProfile, setAuthProfile] = useState('')

  useEffect(() => {
    if (status !== 'Updated!') {
      return
    }
    setTimeout(() => {
      setStatus('')
    }, 1000)
  }, [status])

  const fetchULPSettings = async () => {
    setExperience('') // We unset this so the UI doesn't show prev vals while fetching
    setStatus('Fetching...')

    try {
      const res = await axios(
        `/api/mgmt/prompts/getPrompts?tenant=${tenantLabel}`
      )
      console.log(res.data)

      setCurrentTenant(tenantLabel)
      setExperience(res.data.universal_login_experience)
      setIsCustomPage(res.data.custom_login_page_on)
      setIsIdFirst(res.data.identifier_first)
      setIsWebauthnFirstFactor(res.data.webauthn_platform_first_factor)
      setInitialAuthProfileValue(
        res.data.identifier_first,
        res.data.webauthn_platform_first_factor
      )
      setStatus('')
    } catch (e) {
      console.log(e)
      setStatus('Error fetching ULP Settings')
    }
  }

  const updateAuthProfile = (ev) => {
    const profile = ev.target.value
    setAuthProfile(profile)

    if (profile === 'none') {
      setIsIdFirst(false)
      setIsWebauthnFirstFactor(false)
    } else if (profile === 'id_first') {
      setIsIdFirst(true)
      setIsWebauthnFirstFactor(false)
    } else {
      setIsIdFirst(true)
      setIsWebauthnFirstFactor(true)
    }
  }

  const setInitialAuthProfileValue = (id_first, webauthn) => {
    if (!id_first) {
      setAuthProfile('none')
    } else if (id_first && !webauthn) {
      setAuthProfile('id_first')
    } else {
      setAuthProfile('webauthn')
    }
  }

  const handleClickOpen = async () => {
    setOpen(true)

    // Fetch ULP settings if tenant has changed or if we don't have the settings yet
    if (!experience || currentTenant !== tenantLabel) {
      await fetchULPSettings()
    }
  }

  const handleClose = () => {
    setOpen(false)
    setStatus('')
  }

  const handleUpdate = async () => {
    setStatus('Updating...')
    try {
      await axios.post('/api/mgmt/prompts/patchPrompts', {
        tenantLabel,
        universal_login_experience: experience,
        custom_login_page_on: isCustomPage,
        identifier_first: isIdFirst,
        webauthn_platform_first_factor: isWebauthnFirstFactor,
      })
      setStatus('Updated!')
    } catch (e) {
      console.log(e)
      setStatus('Error updating ULP Settings')
    }
  }

  return (
    <>
      <Dialog open={open} onClose={handleClose} maxWidth="sm" fullWidth={true}>
        <DialogTitle>ULP Settings</DialogTitle>
        <DialogContent>
          {experience && (
            <>
              <Grid container spacing={2}>
                <Grid item xs={5}>
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
                </Grid>
                <Grid item xs={5}>
                  <div>
                    <FormControl component="fieldset">
                      <FormLabel component="legend">
                        Authentication Profile
                      </FormLabel>
                      <RadioGroup
                        value={authProfile}
                        onChange={updateAuthProfile}
                      >
                        <FormControlLabel
                          value="none"
                          control={<Radio />}
                          label="Identifier + Password"
                        />
                        <FormControlLabel
                          value="id_first"
                          control={<Radio />}
                          label="Identifier First"
                        />
                        <FormControlLabel
                          value="webauthn"
                          control={<Radio />}
                          label="ID First + Biometrics"
                        />
                      </RadioGroup>
                    </FormControl>
                  </div>
                </Grid>
              </Grid>
            </>
          )}
          {status && <DialogContentText>{status}</DialogContentText>}
        </DialogContent>
        <DialogActions>
          {experience && (
            <IconButton
              color="primary"
              aria-label="Refresh"
              onClick={fetchULPSettings}
            >
              <RefreshIcon />
            </IconButton>
          )}
          <div style={{ flex: '1 0 0' }} />
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
