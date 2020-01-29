import { Parser } from "html-to-react"
import React from "react"

interface IProps {
  content: string
}

const parser = new Parser()

const HtmlContent: React.FC<IProps> = ({ content }: IProps) => {
  return <>{parser.parse(content)}</>
}

export default HtmlContent
