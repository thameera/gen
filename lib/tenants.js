const REGIONS = ['prod-us', 'pus3', 'eu', 'au']

const TENANTS = [
  {
    label: 'tham@us',
    canonDomain: 'tham.auth0.com',
    manageUrl: 'https://manage.auth0.com/dashboard/us/tham',
    region: 'prod-us',
    clients: [
      {
        name: 'bench11_spa',
        client_id: 'EbzWB8b1TXBiO4ZemYaHXIgk28AH5d7E',
      },
      {
        name: 'bench11_reg',
        client_id: 'oavP61isKqPioPM6fEFJMb9zSRqtZkMA',
      },
    ],
  },
  {
    label: 'tham@eu',
    canonDomain: 'tham.eu.auth0.com',
    manageUrl: 'https://manage.auth0.com/dashboard/eu/tham',
    region: 'eu',
    clients: [
      {
        name: 'spa',
        client_id: 'LjjBj1M1dzf2NHiqEZK4r0MIus9zNyOk',
      },
    ],
  },
]

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
