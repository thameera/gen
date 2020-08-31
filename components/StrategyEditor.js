import * as strategies from '../lib/strategies'
import { useState, useEffect } from 'react'
import {
  TextareaAutosize,
  GridList,
  GridListTile,
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
      {renderStrategyList()}
      <GridList cols={3} cellHeight="auto">
        {snippets.map(renderSnippet)}
      </GridList>
    </>
  )
}
