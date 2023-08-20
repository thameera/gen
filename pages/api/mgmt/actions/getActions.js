import * as mgmtApi from '../../../../lib/mgmtApi'

export default async (req, res) => {
  const { tenant, trigger } = req.query

  if (!tenant) {
    res.statusCode = 400
    res.end('No tenant specified')
    return
  }

  if (!trigger) {
    res.statusCode = 400
    res.end('No trigger specified')
    return
  }

  try {
    const actions = await mgmtApi.getActions(tenant, trigger)
    res.json(actions)
  } catch (e) {
    res.statusCode = 500
    res.json({ err: e })
  }
}
