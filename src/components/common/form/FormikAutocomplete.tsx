import React from "react"
import { FormGroup, Label } from "reactstrap"

import { includeDefaultNamespaces, withTranslation } from "services/i18n"
import FormikElement, { IBaseFormikProps } from "./FormikElement"
import StringAutosuggest from "./StringAutosuggest"

interface IProps extends IBaseFormikProps {
  className: string
  name: string
  noGroup?: boolean
  options: any
  placeholder?: string
  value?: any
}

class FormikAutocomplete extends FormikElement<IProps> {
  public render = () => {
    // extract all properties not allowed / not needed for the input element so the don't get
    // passed down and appear in the HTML
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const { children, field, form, help, id, i18n, label, meta, noGroup = false, options, tReady,
      placeholder, t, value, ...props } = this.props
    const labelText = this.labelText()

    const element = <>
      {labelText.length > 0 && <Label for={field.name}>{labelText}</Label>}

      {this.helpElement()}

      <StringAutosuggest
        className="form-control"
        id={id || field.name}
        options={options}
        invalid={this.hasError()}
        name={field.name}
        onChange={(val) => { form.setFieldValue(field.name, val) }}
        placeholder={placeholder && t(placeholder)}
        value={typeof value !== "number" && typeof value !== "string" ? "" : value}
        {...props}
      />

      {this.errorElement()}
    </>

    return noGroup ? element : <FormGroup>{element}</FormGroup>
  }
}

export default withTranslation(includeDefaultNamespaces())(FormikAutocomplete)
