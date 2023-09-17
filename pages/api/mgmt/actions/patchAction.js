import * as mgmtApi from '../../../../lib/mgmtApi'

export default async (req, res) => {
  if (req.method !== 'POST') {
    res.statusCode = 400
    res.end('This route is meant to be called by POST only')
    return
  }

  const { tenant, action_id, code } = req.body

  if (!tenant) {
    res.statusCode = 400
    res.end('No tenant specified')
    return
  }
  if (!action_id) {
    res.statusCode = 400
    res.end('No Action ID specified')
    return
  }
  if (!code) {
    res.statusCode = 400
    res.end('No code specified')
    return
  }

  try {
    const data = await mgmtApi.patchAction(tenant, action_id, code)
    res.json(data)
  } catch (e) {
    console.log(e)
    res.statusCode = 500
    res.json({ err: e })
  }
}
