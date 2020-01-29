import React from "react"

import TranslatedHtml from "components/common/TranslatedHtml"

interface IProps {
  errors: { [key: string]: any }
  values?: { [key: string]: any }
}

const GeneralFormError: React.FC<IProps> = ({ errors, values = {} }) => {
  const elements = Object.keys(values)

  const generalErrors = []
  Object.keys(errors).forEach((key) => {
    if (elements.includes(key)) {
      return
    }

    generalErrors.push(errors[key].toString())
  })

  if (generalErrors.length === 0) {
    return <></>
  }

  return <div className="form-general-error-container">
    {generalErrors.map((err, index) =>
      <div className="form-general-error" key={index}>
        <TranslatedHtml content={"_error:" + err} />
      </div>,
    )}
  </div>
}

export default GeneralFormError
