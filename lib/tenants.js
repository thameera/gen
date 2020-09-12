import * as TENANTS from './tenantData'
import axios from 'axios'
const NodeCache = require('node-cache')

const tokenCache = new NodeCache()

const REGIONS = ['prod-us', 'pus3', 'eu', 'au']

const createTenantObject = (t) => {
  const domains = t.customDomain
    ? [t.customDomain, t.canonDomain]
    : [t.canonDomain]
  return {
    label: t.label,
    domains,
    manageUrl: t.manageUrl,
  }
}

export const getTenants = () => {
  const perRegion = REGIONS.map((r) => {
    const tenants = TENANTS.filter((t) => t.region === r).map(
      createTenantObject
    )
    return {
      region: r,
      tenants,
    }
  })
  return perRegion.filter((r) => r.tenants.length > 0)
}

export const getTenantByLabel = (label) => {
  const t = TENANTS.find((t) => t.label === label)
  return createTenantObject(t)
}

export const getClientsByTenant = (label) => {
  const tenant = TENANTS.find((t) => t.label === label)
  return tenant.clients
}

export const getAPI2Token = async (label) => {
  const tenant = TENANTS.find((t) => t.label === label)
  if (
    !tenant.m2mClient ||
    !tenant.m2mClient.client_id ||
    !tenant.m2mClient.client_secret
  ) {
    throw new Error("Tenant's API Explorer client is not configured")
  }

  const domain = `https://${tenant.canonDomain}`

  try {
    const res = await axios({
      method: 'POST',
      url: `${domain}/oauth/token`,
      data: {
        client_id: tenant.m2mClient.client_id,
        client_secret: tenant.m2mClient.client_secret,
        audience: `${domain}/api/v2/`,
        grant_type: 'client_credentials',
      },
    })
    const token = res.data.access_token
    tokenCache.set(label, token, res.data.expires_in)
    return token
  } catch (e) {
    console.log(e.response || e)
    throw new Error(`Error from Auth0: ${JSON.stringify(e.response.data)}`)
  }
}

const getCachedAPI2Token = async (label) => {
  let token = tokenCache.get(label)
  if (token) {
    console.log('token cache hit')
  }
  if (!token) {
    console.log('token cache miss')
    token = await getAPI2Token(label)
  }
  return token
}

const makeAPI2Call = async (tenantLabel, method, endpoint, data) => {
  const tenant = TENANTS.find((t) => t.label === tenantLabel)
  const domain = `https://${tenant.canonDomain}`
  const url = `${domain}${endpoint}`

  const token = await getCachedAPI2Token(tenantLabel)

  try {
    const res = await axios({
      method,
      url,
      data,
      headers: {
        Authorization: `Bearer ${token}`,
      },
    })
    return res.data
  } catch (e) {
    console.log(e.response || e)
    throw new Error(`Error from Auth0: ${JSON.stringify(e.response.data)}`)
  }
}

export const getPwChangeTicket = async (
  label,
  connection_id,
  email,
  result_url
) => {
  const res = await makeAPI2Call(
    label,
    'POST',
    '/api/v2/tickets/password-change',
    {
      connection_id,
      email,
      result_url,
    }
  )
  return res.ticket
}
