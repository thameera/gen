import * as mgmtApi from '../../../../lib/mgmtApi'

export default async (req, res) => {
  if (req.method !== 'POST') {
    res.statusCode = 400
    res.end('This route is meant to be called by POST only')
    return
  }
  if (!req.body || !req.body.tenantLabel) {
    res.statusCode = 400
    res.end('No tenant specified')
    return
  }
  if (!req.body.universal_login_experience) {
    res.statusCode = 400
    res.end('No ULP experience specified')
    return
  }
  if (
    req.body.custom_login_page_on === null ||
    req.body.custom_login_page_on === undefined
  ) {
    res.statusCode = 400
    res.end('No custom login page status specified')
    return
  }

  const data = {
    universal_login_experience: req.body.universal_login_experience,
    custom_login_page_on: req.body.custom_login_page_on,
    identifier_first: req.body.identifier_first,
    webauthn_platform_first_factor: req.body.webauthn_platform_first_factor,
  }

  try {
    await mgmtApi.patchPrompts(req.body.tenantLabel, data)
    res.end()
  } catch (e) {
    res.statusCode = 400
    res.json({ err: e })
  }
}
