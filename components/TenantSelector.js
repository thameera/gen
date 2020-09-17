import * as tenantMgr from '../lib/tenants'
import { useState, useEffect } from 'react'
import {
  FormControl,
  InputLabel,
  Select,
  makeStyles,
  FormHelperText,
  Box,
  Button,
  FormLabel,
  RadioGroup,
  FormControlLabel,
  Radio,
} from '@material-ui/core'
import axios from 'axios'
import CopyTokenButton from './CopyTokenButton'

const useStyles = makeStyles(() => ({
  formControl: {
    minWidth: 160,
    marginRight: '20px',
  },
  helperLink: {
    color: '#88f',
  },
  buttonRow: {
    marginTop: '10px',
  },
}))

export default function TenantSelector({ onUpdate }) {
  const tenantsPerRegion = tenantMgr.getTenants()
  const [selectedTenant, setSelectedTenant] = useState(
    tenantsPerRegion[0].tenants[0]
  )
  const [tenantClients, setTenantClients] = useState([])
  const [selectedClientId, setSelectedClientId] = useState('')
  const [selectedDomain, setSelectedDomain] = useState(
    selectedTenant.domains[0]
  )

  const classes = useStyles()

  /*
   * Get updated list of clients when tenant changes
   */
  useEffect(() => {
    const clients = tenantMgr.getClientsByTenant(selectedTenant.label)
    setTenantClients(clients)
    setSelectedClientId(clients[0].client_id)
    setSelectedDomain(selectedTenant.domains[0])
    console.log(selectedTenant)
  }, [selectedTenant])

  /*
   * Bubble up tenant/client changes to index.js
   */
  useEffect(() => {
    onUpdate({
      tenantDomain: selectedDomain,
      client_id: selectedClientId,
    })
  }, [selectedDomain, selectedClientId])

  const onTenantChange = (e) => {
    const t = tenantMgr.getTenantByLabel(e.target.value)
    setSelectedTenant(t)
  }

  const getPwChangeTicket = async () => {
    const res = await axios('/api/mgmt/pw-change-ticket')
    if (res.data.error) {
      // TODO handle error
      console.log(res.data)
      return
    }
    window.open(res.data.ticket, '_blank')
  }

  return (
    <>
      <FormControl className={classes.formControl}>
        <InputLabel htmlFor="tenantSelect">Tenant</InputLabel>
        <Select
          native
          id="tenantSelect"
          value={selectedTenant.label}
          onChange={onTenantChange}
        >
          {tenantsPerRegion.map((r) => (
            <optgroup label={r.region} key={r.region}>
              {r.tenants.map((t) => (
                <option value={t.label} key={t.label}>
                  {t.label}
                </option>
              ))}
            </optgroup>
          ))}
        </Select>
        <FormHelperText className={classes.helperLink}>
          <a href={selectedTenant.manageUrl} target="_blank">
            Open tenant
          </a>
        </FormHelperText>
      </FormControl>

      <FormControl className={classes.formControl}>
        <InputLabel htmlFor="clientSelect">Client</InputLabel>
        <Select
          native
          id="clientSelect"
          value={selectedClientId}
          onChange={(e) => setSelectedClientId(e.target.value)}
        >
          {tenantClients.map((c) => (
            <option value={c.client_id} key={c.client_id}>
              {c.name} - {c.client_id}
            </option>
          ))}
        </Select>
        <FormHelperText className={classes.helperLink}>
          <a
            href={`${selectedTenant.manageUrl}/applications/${selectedClientId}/settings`}
            target="_blank"
          >
            Open client settings
          </a>
        </FormHelperText>
      </FormControl>

      {selectedTenant.domains.length === 2 && (
        <FormControl component="fieldset">
          <FormLabel component="legend">Domain</FormLabel>
          <RadioGroup
            value={selectedDomain}
            onChange={(e) => setSelectedDomain(e.target.value)}
          >
            <FormControlLabel
              value={selectedTenant.domains[0]}
              control={<Radio />}
              label={selectedTenant.domains[0]}
            />
            <FormControlLabel
              value={selectedTenant.domains[1]}
              control={<Radio />}
              label={selectedTenant.domains[1]}
            />
          </RadioGroup>
        </FormControl>
      )}

      <Box className={classes.buttonRow}>
        <CopyTokenButton tenantLabel={selectedTenant.label} />
        <Button variant="contained" color="primary" onClick={getPwChangeTicket}>
          Open a Password Change ticket
        </Button>
      </Box>
    </>
  )
}
