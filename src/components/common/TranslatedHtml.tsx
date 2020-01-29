import React from "react"

import { useTranslation } from "services/i18n"
import HtmlContent from "./HtmlContent"

interface IProps {
  content: string
  params?: any
}

const TranslatedHtml: React.FC<IProps> = ({ content, params = null }: IProps) => {
  const { t } = useTranslation()
  return <HtmlContent content={t(content, params)} />
}

export default TranslatedHtml
