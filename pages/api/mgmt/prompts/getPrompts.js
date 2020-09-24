import * as mgmtApi from '../../../../lib/mgmtApi'

export default async (req, res) => {
  if (!req.query || !req.query.tenant) {
    res.statusCode = 400
    res.end('No tenant specified')
    return
  }

  try {
    const prompt = await mgmtApi.getPrompts(req.query.tenant)
    res.json(prompt)
  } catch (e) {
    res.statusCode = 400
    res.json({ err: e })
  }
}
