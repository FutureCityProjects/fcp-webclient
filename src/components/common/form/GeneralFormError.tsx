import React from "react"

import TranslatedHtml from "components/common/TranslatedHtml"
import { flattenErrors } from "services/submissionError"

interface IProps {
  errors: { [key: string]: any }
  excludeFields?: string[]
  prefix?: string
}

const GeneralFormError: React.FC<IProps> = ({ errors, excludeFields = [], prefix = "" }) => {
  const generalErrors = []
  Object.keys(errors).forEach((key) => {

    // these fields show their own errors, no need to show them here
    if (excludeFields.includes(key)) {
      return
    }

    if (typeof errors[key] === "string") {
      generalErrors.push(<TranslatedHtml content={"_error:" + errors[key]} />)
    }

    // we may receive nested errors here, e.g. for forms that submit JSON elements ->
    // flatten the errors and display the propertyPath in front of the error:
    else {
      const elementErrors = flattenErrors(errors[key], prefix ? prefix + "." + key : key)
      Object.keys(elementErrors).forEach((k) => {
        generalErrors.push(<>
          <TranslatedHtml content={k} />
          : <TranslatedHtml content={"_error:" + elementErrors[k]} />
        </>)
      })
    }
  })

  if (generalErrors.length === 0) {
    return null
  }

  return <div className="form-general-error-container">
    {generalErrors.map((err, index) =>
      <div className="form-general-error" key={index}>{err}</div>
    )}
  </div>
}

export default GeneralFormError
