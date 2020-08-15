// Next.js API route support: https://nextjs.org/docs/api-routes/introduction

export default (req, res) => {
  res.statusCode = 200
  if (req.method !== 'POST') {
    res.end('This route is meant to be called by POST only')
    return
  }

  const data = req.body
  res.json({ status: `File name would be ${data.name}` })
}
