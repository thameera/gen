import * as tenantMgr from '../../../lib/tenants'

export default async (req, res) => {
  try {
    // TODO set tenant label and other info dynamically from request
    const ticket = await tenantMgr.getPwChangeTicket(
      'tham@us',
      'con_AZIsqkQ5CC5EoxMK',
      'thameera+1@auth0.com',
      'https://thameera.com/callback'
    )
    res.json({ ticket })
  } catch (e) {
    res.statusCode = 400
    res.json({ err: e })
  }
}
