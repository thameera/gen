import fs from 'fs'
import * as strategies from '../../lib/strategies'

const DEST_PATH = '/Users/thameerasenanayaka/auth0/ws/tham'

const copyFile = (data) => {
  if (!data.name) {
    return { err: 'Filename not specified' }
  }
  if (!data.strategy || !data.strategy.name) {
    return { err: 'Invalid or no strategy specified' }
  }

  const url = `http://tham.localhost/${data.name}.html`

  const output = strategies.getFilledTemplate(fs, data.strategy.name, {
    tenantDomain: 'tham.auth0.com',
    clientID: 'EbzWB8b1TXBiO4ZemYaHXIgk28AH5d7E',
    url,
    snippets: data.strategy.snippets,
  })

  const filepath = `${DEST_PATH}/${data.name}.html`
  fs.writeFileSync(filepath, output, 'utf8')
  console.log(`Wrote to ${filepath}`)

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
