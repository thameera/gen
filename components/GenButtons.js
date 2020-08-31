import { Button } from '@material-ui/core'
import axios from 'axios'

export default function GenButtons({ env, strategy }) {
  const generate = async () => {
    const res = await axios({
      method: 'POST',
      url: '/api/generate',
      data: { name: 'tmp', env, strategy },
    })
    if (res.data.error) {
      // TODO handle error
      console.log(res.data)
      return
    }
    window.open(res.data.path, '_blank')
  }

  return (
    <>
      <Button variant="contained" color="primary" onClick={generate}>
        Generate tmp.html
      </Button>
    </>
  )
}
