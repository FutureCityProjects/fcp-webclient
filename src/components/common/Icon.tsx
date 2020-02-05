import React from "react"
import SVG from "react-inlinesvg"

interface IProps {
  name: string
  size: number
}

export const Icons: string[] = [
  "calendar",
  "cancel",
  "caret",
  "check",
  "compasses",
  "document",
  "download-cloud",
  "facebook",
  "grid",
  "hand",
  "info-bubble",
  "instagram",
  "light-bulb",
  "message",
  "minus",
  "money-bag",
  "pencil",
  "plus",
  "pot",
  "save",
  "search",
  "to-do",
  "trash",
  "twitter",
  "upload",
  "user",
  "user-add",
  "user-multiple",
]

const Icon = (props: IProps) => {
  const { name, size } = props
  const path = `/assets/icons/${name}.svg`

  if (Icons.includes(name))
    return <SVG src={path} height={size} />
  else return <>[?]</>
}

export default Icon
