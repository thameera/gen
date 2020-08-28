export default {
  'auth0js-implicit': {
    template: 'auth0js.html',
    snippets: [
      {
        name: 'constructor',
        value: {
          domain: '%tenant%',
          clientID: '%client_id%',
          responseType: 'token id_token',
          redirectUri: '%url%',
          scope: 'openid profile email',
        },
      },
    ],
  },
}
