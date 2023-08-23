import * as mgmtApi from '../../../../lib/mgmtApi'

export default async (req, res) => {
  const { tenant } = req.query

  if (!tenant) {
    res.statusCode = 400
    res.end('No tenant specified')
    return
  }

  try {
    const actions = await mgmtApi.getActions(tenant)
    res.json(actions)
  } catch (e) {
    console.log(e)
    res.statusCode = 500
    res.json({ err: e })
  }
}
