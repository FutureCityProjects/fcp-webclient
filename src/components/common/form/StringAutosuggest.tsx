import React, { useState } from "react"
import Autosuggest from "react-autosuggest"

interface IProps {
  className?: string
  name?: string
  id?: string
  invalid?: boolean
  onChange: any
  options: any
  placeholder?: string
  value?: any
}

const StringAutosuggest: React.FC<IProps> = (props: IProps) => {
  const { onChange, options, ...rest } = props
  const [suggestions, setSuggestions] = useState([])

  // pass the new value up the chain
  const handleChange = (_event, { newValue }) => {
    onChange(newValue)
  }

  // filter all options for matching suggestions. When nothing was entered we want
  // to show all options, else match at the start of the string, lowercase
  const getSuggestions = (val) => {
    const inputValue = val.trim().toLowerCase()
    const inputLength = inputValue.length

    const res = inputLength === 0
      ? options
      : options.filter((o: string) =>
        o.toLowerCase().slice(0, inputLength) === inputValue
      )

    return res
  }

  // in case a suggestion is an object we could return its ID etc.
  // we just return the string
  const getSuggestionValue = (suggestion) => suggestion

  // how should the suggestions be shown in the dropdown?
  const renderSuggestion = (suggestion) => <div className="text-left">{suggestion}</div>

  // trigger state update
  const onSuggestionsFetchRequested = ({ value }) => setSuggestions(getSuggestions(value))
  const onSuggestionsClearRequested = () => setSuggestions([])

  // under which conditions should the dropdown be shown?
  // e.g. min 2 characters entered. We want it to show also when nothing was entered
  // to allow immediate selection
  const shouldRenderSuggestions = () => true

  return <Autosuggest
    suggestions={suggestions}
    onSuggestionsFetchRequested={onSuggestionsFetchRequested}
    onSuggestionsClearRequested={onSuggestionsClearRequested}
    getSuggestionValue={getSuggestionValue}
    renderSuggestion={renderSuggestion}
    shouldRenderSuggestions={shouldRenderSuggestions}
    inputProps={{ onChange: handleChange, ...rest }}
  />
}

export default StringAutosuggest