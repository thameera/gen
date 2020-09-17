import { Button, makeStyles } from '@material-ui/core'
import axios from 'axios'
import copy from 'copy-to-clipboard'
import { useEffect, useState } from 'react'

const useStyles = makeStyles(() => ({
  button: {
    marginRight: '5px',
  },
}))

export default function CopyTokenButton({ tenantLabel }) {
  const DEFAULT_LABEL = 'Copy API2 Token'
  const [label, setLabel] = useState(DEFAULT_LABEL)
  const [color, setColor] = useState('primary')
  const [intermediateState, setIntermediateState] = useState(false)

  const classes = useStyles()

  useEffect(() => {
    if (!intermediateState) return

    setTimeout(() => {
      setLabel(DEFAULT_LABEL)
      setColor('primary')
      setIntermediateState(false)
    }, 2000)
  }, [intermediateState])

  const getToken = async () => {
    setLabel('Fetching...')
    try {
      const res = await axios(`/api/token?tenant=${tenantLabel}`)
      if (res.data.error) {
        console.log(res.data)
        setLabel('Error!')
        setColor('secondary')
        setIntermediateState(true)
        return
      }
      console.log(res.data.token)
      copy(res.data.token)
      setLabel('Copied!')
      setColor('default')
      setIntermediateState(true)
    } catch (e) {
      console.log(e)
      setLabel('Error!')
      setColor('secondary')
      setIntermediateState(true)
    }
  }

  return (
    <Button
      variant="contained"
      color={color}
      onClick={getToken}
      className={classes.button}
    >
      {label}
    </Button>
  )
}
