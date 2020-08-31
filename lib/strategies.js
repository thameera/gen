const TEMPLATE_PATH = '/Users/thameerasenanayaka/auth0/ws/gen/templates'

const strategies = {
  'auth0js-implicit': {
    label: 'Auth0.js - Implicit',
    template: 'auth0js.html',
    snippets: [
      {
        name: 'constructor',
        value: {
          domain: '%tenant%',
          clientID: '%client_id%',
          redirectUri: '%url%',
          responseType: 'token id_token',
          scope: 'openid profile email',
        },
      },
    ],
  },
  'spajs-iframe': {
    label: 'SPA JS - Iframe',
    template: 'spa-iframe.html',
    snippets: [
      {
        name: 'constructor',
        value: {
          domain: '%tenant%',
          clientID: '%client_id%',
          redirectUri: '%url%',
          scope: 'openid profile email',
          audience: 'https://thameera.com',
        },
      },
    ],
  },
}

export const getNames = () =>
  Object.keys(strategies).map((s) => ({ id: s, label: strategies[s].label }))

export const getDefaultSnippets = (name) => strategies[name].snippets

/*
 * We get 'fs' as an arg, because this module is also imported by
 * the frontend which doesn't have 'fs' there
 */
export const getFilledTemplate = (fs, name, opts) => {
  const strategy = strategies[name]

  let template = fs.readFileSync(
    `${TEMPLATE_PATH}/${strategy.template}`,
    'utf8'
  )

  opts.snippets.forEach((snippet) => {
    const re = new RegExp(`__GEN_SNIPPET_${snippet.name}`, 'g')
    template = template.replace(re, snippet.value)
  })

  template = template.replace(/%tenant%/g, opts.tenantDomain)
  template = template.replace(/%client_id%/g, opts.clientID)
  template = template.replace(/%url%/g, opts.url)

  return template
}
