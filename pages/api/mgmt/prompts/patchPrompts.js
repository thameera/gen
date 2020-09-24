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

  const data = {
    universal_login_experience: req.body.universal_login_experience,
  }

  try {
    await mgmtApi.patchPrompts(req.body.tenantLabel, data)
    res.end()
  } catch (e) {
    res.statusCode = 400
    res.json({ err: e })
  }
}
