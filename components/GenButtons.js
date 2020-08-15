import { Button } from '@material-ui/core'
import axios from 'axios'

const generate = async () => {
  const res = await axios({
    method: 'POST',
    url: '/api/generate',
    data: { name: 'tmp' },
  })
  console.log(res.data)
  if (res.data.error) {
    // TODO handle error
    return
  }
  window.open(res.data.path, '_blank')
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
