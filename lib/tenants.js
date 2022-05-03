import * as TENANTS from './tenantData'
import axios from 'axios'

const REGIONS = ['prod-us', 'pus3', 'eu', 'au', 'jp', 'pus2', 'testland']

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
  return TENANTS.find((t) => t.label === label)
}

export const getTenantByLabelForFrontend = (label) => {
  const t = TENANTS.find((t) => t.label === label)
  return createTenantObject(t)
}

export const getClientsByTenant = (label) => {
  const tenant = TENANTS.find((t) => t.label === label)
  return tenant.clients
}
