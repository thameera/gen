import * as tenantMgr from '../lib/tenants'
import axios from 'axios'
const NodeCache = require('node-cache')

const tokenCache = new NodeCache()

/*
 * Tokens
 */
export const getAPI2Token = async (label) => {
  const tenant = tenantMgr.getTenantByLabel(label)
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

const _getCachedAPI2Token = async (label) => {
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
/*
 * End of Tokens
 */

/*
 * Helpers
 */
const _makeAPI2Call = async (tenantLabel, method, endpoint, data) => {
  const tenant = tenantMgr.getTenantByLabel(tenantLabel)
  const domain = `https://${tenant.canonDomain}`
  const url = `${domain}${endpoint}`

  const token = await _getCachedAPI2Token(tenantLabel)

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
    console.log(`Error while making API2 call: ${method} ${url}`)
    console.log(e.response || e)
    throw new Error(`Error from Auth0: ${JSON.stringify(e.response.data)}`)
  }
}
/*
 * End of Helpers
 */

/*
 * Clients
 */
export const getClient = async (label, client_id) => {
  const res = await _makeAPI2Call(label, 'GET', `/api/v2/clients/${client_id}`)
  return res
}

export const patchClient = async (label, client_id, data) => {
  const res = await _makeAPI2Call(
    label,
    'PATCH',
    `/api/v2/clients/${client_id}`,
    data
  )
  return res
}
/*
 * End of Clients
 */

/*
 * Prompts
 * We handle both New/Classic ULP and custom_login_page_on properties here
 */
export const getPrompts = async (label) => {
  const tenant = tenantMgr.getTenantByLabel(label)

  const res = await Promise.all([
    _makeAPI2Call(label, 'GET', `/api/v2/prompts`),
    _makeAPI2Call(label, 'GET', `/api/v2/clients/${tenant.globalClient_id}`),
  ])

  return {
    ...res[0],
    custom_login_page_on: res[1].custom_login_page_on,
  }
}

export const patchPrompts = async (label, data) => {
  const tenant = tenantMgr.getTenantByLabel(label)

  console.log(data)
  const custom_login_page_on = data.custom_login_page_on
  delete data.custom_login_page_on
  console.log({ custom_login_page_on })
  console.log(data)
  const res = await Promise.all([
    _makeAPI2Call(label, 'PATCH', `/api/v2/prompts`, data),
    _makeAPI2Call(label, 'PATCH', `/api/v2/clients/${tenant.globalClient_id}`, {
      custom_login_page_on,
    }),
  ])

  return {
    ...res[0],
    custom_login_page_on: res[1].custom_login_page_on,
  }
}
/*
 * End of Prompts
 */

/*
 * Tickets
 */
export const getPwChangeTicket = async (
  label,
  connection_id,
  email,
  result_url
) => {
  const res = await _makeAPI2Call(
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
/*
 * End of Tickets
 */

/*
 * Actions
 */
export const getActions = async (label, trigger) => {
  const res = await _makeAPI2Call(
    label,
    'GET',
    `/api/v2/actions/triggers/${trigger}/bindings`
  )

  // Extract only what we need from response
  const actions = res.bindings.map((binding) => {
    return {
      action_id: binding.action.id,
      name: binding.action.name,
      code: binding.action.current_version.code,
    }
  })
  console.log(`Found ${actions.length} actions for trigger ${trigger}`)

  return actions
}
