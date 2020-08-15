import fs from 'fs'

const DEST_PATH = '/Users/thameerasenanayaka/auth0/ws/tham'
const TEMPLATE_PATH = '/Users/thameerasenanayaka/auth0/ws/gen/templates'

const copyFile = (name) => {
  const template = fs.readFileSync(`${TEMPLATE_PATH}/auth0js.html`, 'utf8')
  const filepath = `${DEST_PATH}/${name}.html`
  fs.writeFileSync(filepath, template, 'utf8')
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
  copyFile(data.name)
  res.json({ path: `http://tham.localhost/${data.name}.html` })
}
