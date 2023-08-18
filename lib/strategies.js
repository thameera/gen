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
      {
        name: 'authorize',
        value: {
          audience: 'https://thameera.com',
        },
      },
      {
        name: 'checkSession',
        value: {
          audience: 'https://thameera.com',
        },
      },
      {
        name: 'logout',
        value: {
          returnTo: '%url%',
          clientID: '%client_id%',
        },
      },
    ],
  },
  'spajs-v2-iframe': {
    label: 'SPA JS v2 - Iframe',
    template: 'spajs-v2.html',
    snippets: [
      {
        name: 'constructor',
        value: {
          domain: '%tenant%',
          clientId: '%client_id%',
          authorizationParams: {
            redirect_uri: '%url%',
            scope: 'openid profile email',
            audience: 'https://thameera.com',
          },
        },
      },
      {
        name: 'loginWithRedirect',
        value: {},
      },
      {
        name: 'loginWithPopup',
        value: {},
      },
      {
        name: 'getTokenSilently',
        value: {
          ignoreCache: true,
        },
      },
      {
        name: 'logout',
        value: {
          clientId: '%client_id%',
          logoutParams: {
            returnTo: '%url%',
          },
        },
      },
    ],
  },
  'spajs-iframe': {
    label: 'SPA JS - Iframe',
    template: 'spajs.html',
    snippets: [
      {
        name: 'constructor',
        value: {
          domain: '%tenant%',
          client_id: '%client_id%',
          redirect_uri: '%url%',
          scope: 'openid profile email',
          audience: 'https://thameera.com',
        },
      },
      {
        name: 'loginWithRedirect',
        value: {},
      },
      {
        name: 'loginWithPopup',
        value: {},
      },
      {
        name: 'getTokenSilently',
        value: {
          ignoreCache: true,
        },
      },
      {
        name: 'logout',
        value: {
          returnTo: '%url%',
          client_id: '%client_id%',
        },
      },
    ],
  },
  'spajs-rtr': {
    label: 'SPA JS - RTR',
    template: 'spajs.html',
    snippets: [
      {
        name: 'constructor',
        value: {
          domain: '%tenant%',
          client_id: '%client_id%',
          redirect_uri: '%url%',
          scope: 'openid profile email',
          audience: 'https://thameera.com',
          useRefreshTokens: true,
          cacheLocation: 'localstorage',
        },
      },
      {
        name: 'loginWithRedirect',
        value: {},
      },
      {
        name: 'loginWithPopup',
        value: {},
      },
      {
        name: 'getTokenSilently',
        value: {
          ignoreCache: true,
        },
      },
      {
        name: 'logout',
        value: {
          returnTo: '%url%',
          client_id: '%client_id%',
        },
      },
    ],
  },
  lock: {
    label: 'Lock - Embedded',
    template: 'lock.html',
    snippets: [
      {
        name: 'lockOptions',
        value: {
          autoclose: true,
          auth: {
            redirectUrl: '%url%',
            responseType: 'token id_token',
            params: {
              scope: 'openid profile email',
            },
            audience: 'https://thameera.com',
          },
        },
      },
      {
        name: 'lockShow',
        value: {},
      },
      {
        name: 'checkSession',
        value: {},
      },
      {
        name: 'logout',
        value: {
          returnTo: '%url%',
          client_id: '%client_id%',
        },
      },
    ],
  },
  'auth0js-embedded': {
    label: 'Auth0.js - Embedded Login',
    template: 'auth0js-embedded.html',
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
      {
        name: 'login',
        value: {
          realm: 'Username-Password-Authentication',
          audience: 'https://thameera.com',
        },
      },
      {
        name: 'checkSession',
        value: {
          audience: 'https://thameera.com',
        },
      },
      {
        name: 'logout',
        value: {
          returnTo: '%url%',
          clientID: '%client_id%',
        },
      },
    ],
  },
  orgs: {
    label: 'Organizations',
    template: 'orgs.html',
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
      {
        name: 'authorize',
        hint: 'organization will be added if available',
        value: {
          audience: 'https://thameera.com',
        },
      },
      {
        name: 'checkSession',
        hint: 'organization will be added if available',
        value: {
          audience: 'https://thameera.com',
        },
      },
      {
        name: 'logout',
        value: {
          returnTo: '%url%',
          clientID: '%client_id%',
        },
      },
      {
        name: 'inviteAuthorize',
        hint: 'organization and invitation will be added automatically',
        value: {
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

  let template = fs.readFileSync(`./templates/${strategy.template}`, 'utf8')

  opts.snippets.forEach((snippet) => {
    const re = new RegExp(`__GEN_SNIPPET_${snippet.name}`, 'g')
    template = template.replace(re, snippet.value)
  })

  template = template.replace(/%tenant%/g, opts.tenantDomain)
  template = template.replace(/%client_id%/g, opts.clientID)
  template = template.replace(/%url%/g, opts.url)
  template = template.replace(/%strategy_name%/g, strategy.label)

  return template
}
