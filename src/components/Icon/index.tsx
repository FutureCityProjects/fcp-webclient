import React from "react"

export const Icons: { [Key: string]: { default: any } } = {
  "calendar": require("./Calendar"),
  "caret": require("./Caret"),
  "check": require("./Check"),
  "compasses": require("./Compasses"),
  "document": require("./Document"),
  "download-cloud": require("./DownloadCloud"),
  "facebook": require("./Facebook"),
  "grid": require("./Grid"),
  "hand": require("./Hand"),
  "info-bubble": require("./InfoBubble"),
  "instagram": require("./Instagram"),
  "light-bulb": require("./LightBulb"),
  "message": require("./Message"),
  "minus": require("./Minus"),
  "money-bag": require("./MoneyBag"),
  "pencil": require("./Pencil"),
  "plus": require("./Plus"),
  "pot": require("./Pot"),
  "save": require("./Save"),
  "search": require("./Search"),
  "to-do": require("./ToDo"),
  "trash": require("./Trash"),
  "twitter": require("./Twitter"),
  "upload": require("./Upload"),
  "user": require("./User"),
  "user-add": require("./UserAdd"),
  "user-multiple": require("./UserMultiple"),
}

interface IProps {
  color?: string
  name: string
  size: number
}

const Icon = (props: IProps) => {
  const { name, ...rest } = props
  if (Object.keys(Icons).includes(name)) {
    const Comp = Icons[name].default
    return <Comp {...rest} />
  }

  return <>[?]</>
}

export default Icon
