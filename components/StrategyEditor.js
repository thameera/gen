import * as strategies from '../lib/strategies'
import { useState, useEffect } from 'react'
import {
  TextareaAutosize,
  ImageList,
  ImageListItem,
  makeStyles,
  FormControl,
  FormLabel,
  RadioGroup,
  FormControlLabel,
  Radio,
} from '@material-ui/core'

const useStyles = makeStyles({
  textarea: {
    width: '100%',
    marginTop: '5px',
  },
  snippetName: {
    marginTop: '10px',
    fontWeight: 'bold',
  },
  snippetHint: {
    fontSize: '0.8em',
  },
})

export default function StrategyEditor({ onUpdate }) {
  const strategyList = strategies.getNames()
  const [strategyName, setStrategyName] = useState(strategyList[0].id)
  const [snippets, setSnippets] = useState([])
  const classes = useStyles()

  /*
   * Update snippets list when strategyName updates
   */
  useEffect(() => {
    const stringifiedSnippets = strategies
      .getDefaultSnippets(strategyName)
      .map((sn) => ({
        name: sn.name,
        hint: sn.hint,
        value: JSON.stringify(sn.value, 0, 2),
      }))
    setSnippets(stringifiedSnippets)
  }, [strategyName])

  /*
   * Bubble up strategy changes to index.js when anything is updated
   */
  useEffect(() => {
    const s = {
      name: strategyName,
      snippets,
    }
    onUpdate(s)
  }, [strategyName, snippets])

  // TODO move this under 'renderSnippet'
  const onUpdateSnippet = (val, idx) => {
    const newSnippets = [...snippets]
    newSnippets[idx] = val
    setSnippets(newSnippets)
  }

  const renderStrategyList = () => {
    return (
      <FormControl component="fieldset">
        <FormLabel component="legend">Strategy</FormLabel>
        <RadioGroup
          value={strategyName}
          onChange={(e) => setStrategyName(e.target.value)}
        >
          {strategyList.map((s) => (
            <FormControlLabel
              control={<Radio />}
              value={s.id}
              label={s.label}
              key={s.id}
            />
          ))}
        </RadioGroup>
      </FormControl>
    )
  }

  const renderSnippet = (snippet, idx) => {
    let val = snippet.value
    if (typeof val === 'object') {
      val = JSON.stringify(val, 0, 2)
    }

    const onChange = (e) => {
      const newSnippet = { ...snippet, value: e.target.value }
      onUpdateSnippet(newSnippet, idx)
    }

    return (
      <ImageListItem key={idx}>
        <div className={classes.snippetName}>{snippet.name}</div>
        {snippet.hint && (
          <div className={classes.snippetHint}>{snippet.hint}</div>
        )}
        <TextareaAutosize
          className={classes.textarea}
          value={val}
          onChange={onChange}
        />
      </ImageListItem>
    )
  }

  return (
    <>
      {renderStrategyList()}
      <ImageList cols={3} rowHeight="auto">
        {snippets.map(renderSnippet)}
      </ImageList>
    </>
  )
}
