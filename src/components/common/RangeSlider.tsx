import React from "react"
import Slider from "react-rangeslider"

interface IProps {
  id?: string
  labels: Record<string, unknown>
  onChange?: any
  static?: boolean
  value?: number
}

const RangeSlider: React.FC<IProps> = (props: IProps) => {
  const formatPercent = (num: number) => num.toString() + "%"

  return <div className={(props.static ? "slider-static " : "") + "slider custom-labels"}>
    <Slider
      id={props.id}
      min={0}
      max={100}
      step={25}
      value={props.value}
      labels={props.labels}
      format={formatPercent}
      onChange={props.onChange}
      tooltip={false}
    />
  </div>
}

export default RangeSlider
