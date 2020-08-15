import { Button } from '@material-ui/core'
import axios from 'axios'

const generate = async () => {
  const res = await axios({
    method: 'POST',
    url: '/api/generate',
    data: { name: 'tmp' },
  })
  console.log(res.data)
}

export default function GenButtons() {
  return (
    <>
      <Button variant="contained" color="primary" onClick={generate}>
        Generate tmp.html
      </Button>
    </>
  )
}
