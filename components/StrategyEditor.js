import * as strategies from '../lib/strategies'
import { useState, useEffect } from 'react'
import {
  TextareaAutosize,
  GridList,
  GridListTile,
  makeStyles,
} from '@material-ui/core'

const useStyles = makeStyles({
  textarea: {
    width: '100%',
  },
})

export default function StrategyEditor({ onUpdate }) {
  const [strategyName, setStrategyName] = useState('auth0js-implicit')
  const stringifiedSnippets = strategies
    .getDefaultSnippets(strategyName)
    .map((sn) => ({
      name: sn.name,
      value: JSON.stringify(sn.value, 0, 2),
    }))
  const [snippets, setSnippets] = useState(stringifiedSnippets)
  const classes = useStyles()

  useEffect(() => {
    const s = {
      name: strategyName,
      snippets,
    }
    onUpdate(s)
  }, [strategyName, snippets])

  const onUpdateSnippet = (val, idx) => {
    const newSnippets = [...snippets]
    newSnippets[idx] = val
    setSnippets(newSnippets)
  }

  const renderSnippet = (snippet, idx) => {
    let val = snippet.value
    if (typeof val === 'object') {
      val = JSON.stringify(val, 0, 2)
    }

    const onChange = (e) => {
      onUpdateSnippet({ name: snippet.name, value: e.target.value }, idx)
    }

    return (
      <GridListTile key={idx}>
        <p>
          <strong>{snippet.name}</strong>
        </p>
        <TextareaAutosize
          className={classes.textarea}
          value={val}
          onChange={onChange}
        />
      </GridListTile>
    )
  }

  return (
    <>
      <GridList cols={3} cellHeight="auto">
        {snippets.map(renderSnippet)}
      </GridList>
    </>
  )
}
