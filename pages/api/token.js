import * as tenantMgr from '../../lib/tenants'

export default async (req, res) => {
  try {
    // TODO set tenant label dynamically from request
    const token = await tenantMgr.getAPI2Token('tham@us')
    res.json({ token })
  } catch (e) {
    res.statusCode = 400
    res.json({ err: e })
  }
}
