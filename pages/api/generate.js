import fs from 'fs'
import * as strategies from '../../lib/strategies'
import * as mgmtApi from '../../lib/mgmtApi'

// Path where output html files should be written to
const DEST_PATH = process.env.DEST_PATH
// Domain which serves the generated html files - can be something like http://localhost:3000 or a custom one like http://tham.localhost
const LOCAL_DOMAIN = process.env.LOCAL_DOMAIN

const updateClientURLs = async (tenantLabel, clientID, url) => {
  const client = await mgmtApi.getClient(tenantLabel, clientID)
  const callbacks = client.callbacks || []
  const allowed_logout_urls = client.allowed_logout_urls || []
  const web_origins = client.web_origins || []

  if (
    callbacks.includes(url) &&
    allowed_logout_urls.includes(url) &&
    web_origins.includes(LOCAL_DOMAIN)
  ) {
    return
  }

  console.log(
    `Client has missing whitelist URLs. Going to patch client: ${clientID}`
  )
  if (!callbacks.includes(url)) {
    callbacks.push(url)
  }
  if (!allowed_logout_urls.includes(url)) {
    allowed_logout_urls.push(url)
  }
  if (!web_origins.includes(LOCAL_DOMAIN)) {
    web_origins.push(LOCAL_DOMAIN)
  }

  await mgmtApi.patchClient(tenantLabel, clientID, {
    callbacks,
    allowed_logout_urls,
    web_origins,
  })
  console.log('Patched client successfully')
}

const copyFile = (data) => {
  if (!data.name) {
    return { err: 'Filename not specified' }
  }
  if (
    !data.env ||
    !data.env.tenantLabel ||
    !data.env.tenantDomain ||
    !data.env.client_id
  ) {
    return { err: 'No tenant/client specified' }
  }
  if (!data.strategy || !data.strategy.name) {
    return { err: 'Invalid or no strategy specified' }
  }

  const tenantLabel = data.env.tenantLabel
  const tenantDomain = data.env.tenantDomain
  const clientID = data.env.client_id

  const url = `${LOCAL_DOMAIN}/${data.name}.html`

  const output = strategies.getFilledTemplate(fs, data.strategy.name, {
    tenantDomain,
    clientID,
    url,
    snippets: data.strategy.snippets,
  })

  const filepath = `${DEST_PATH}/${data.name}.html`
  fs.writeFileSync(filepath, output, 'utf8')
  console.log(`Wrote to ${filepath}`)

  updateClientURLs(tenantLabel, clientID, url)
  // We are not waiting for the above async update to finish

  return { url }
}

export default (req, res) => {
  res.statusCode = 200
  if (req.method !== 'POST') {
    res.end('This route is meant to be called by POST only')
    return
  }

  const { err, url } = copyFile(req.body)

  if (err) {
    res.statusCode = 400
    return res.json({ error: err })
  }
  res.json({ path: url })
}
