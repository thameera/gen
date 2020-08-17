import fs from 'fs'
import strategies from '../../lib/strategies'

const DEST_PATH = '/Users/thameerasenanayaka/auth0/ws/tham'
const TEMPLATE_PATH = '/Users/thameerasenanayaka/auth0/ws/gen/templates'

const replaceVariables = (strategy, template, data) => {
  let output = template
  const variables = Object.keys(strategy.variables)
  variables.forEach((k) => {
    const value = data[k] || strategy.variables[k]
    const re = new RegExp(`__GEN_VARIABLE_${k}`, 'g')
    output = output.replace(re, value)
  })
  return output
}

const copyFile = (data) => {
  const strategy = strategies['auth0js-implicit']
  console.log({ strategy })

  const template = fs.readFileSync(
    `${TEMPLATE_PATH}/${strategy.template}`,
    'utf8'
  )
  const output = replaceVariables(strategy, template, data)
  const filepath = `${DEST_PATH}/${data.name}.html`

  fs.writeFileSync(filepath, output, 'utf8')
  console.log(`Wrote to ${filepath}`)
}

export default (req, res) => {
  res.statusCode = 200
  if (req.method !== 'POST') {
    res.end('This route is meant to be called by POST only')
    return
  }

  const data = req.body
  if (!data.name) {
    res.statusCode = 400
    res.json({ error: 'Filename not specified' })
  }
  copyFile(data)
  res.json({ path: `http://tham.localhost/${data.name}.html` })
}
