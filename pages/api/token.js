import * as mgmtApi from '../../lib/mgmtApi'

export default async (req, res) => {
  if (!req.query || !req.query.tenant) {
    res.statusCode = 400
    res.end('No tenant specified')
    return
  }

  try {
    const token = await mgmtApi.getAPI2Token(req.query.tenant)
    res.json({ token })
  } catch (e) {
    res.statusCode = 400
    res.json({ err: e })
  }
}
