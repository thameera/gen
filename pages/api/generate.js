import fs from 'fs'
import strategies from '../../lib/strategies'

const DEST_PATH = '/Users/thameerasenanayaka/auth0/ws/tham'
const TEMPLATE_PATH = '/Users/thameerasenanayaka/auth0/ws/gen/templates'

const replaceVariables = (strategy, template, data) => {
  let output = template
  /*const variables = Object.keys(strategy.variables)
  variables.forEach((k) => {
    const value = data[k] || strategy.variables[k]
    const re = new RegExp(`__GEN_VARIABLE_${k}`, 'g')
    output = output.replace(re, value)
  })*/
  return output
}

const copyFile = (data) => {
  const stratName = data.strategy ? data.strategy.name : 'auth0js-implicit'
  const baseStrategy = strategies[stratName]
  console.log({ baseStrategy })

  const template = fs.readFileSync(
    `${TEMPLATE_PATH}/${baseStrategy.template}`,
    'utf8'
  )
  const output = replaceVariables(baseStrategy, template, data.strategy)
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
