import React from "react"

import TranslatedHtml from "components/common/TranslatedHtml"

interface IProps {
  error?: string
}

const PageError: React.FC<IProps> = ({ error }) => {
  if (!error) {
    return <></>
  }

  return <p className="page-error text-danger">
    <TranslatedHtml content={"_error:" + error} />
  </p>
}

export default PageError
