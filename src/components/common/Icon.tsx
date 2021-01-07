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
  "download",
  "download-cloud",
  "facebook",
  "grid",
  "hand",
  "info-bubble",
  "instagram",
  "light-bulb",
  "market",
  "message",
  "minus",
  "money-bag",
  "pencil",
  "plus",
  "pot",
  "save",
  "search",
  "sort",
  "to-do",
  "trash",
  "twitter",
  "upload",
  "user",
  "user-add",
  "user-multiple",
  "work-package",
]

const Icon: React.FC<IProps> = (props: IProps) => {
  const { name, size } = props
  const path = `/assets/icons/${name}.svg`

  if (Icons.includes(name))
    return <SVG src={path} height={size} />
  else return <>[?]</>
}

export default Icon
