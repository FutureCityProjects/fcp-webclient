import React from "react"
import { FormGroup, Input, Label } from "reactstrap"
import { InputType } from "reactstrap/lib/Input"

import { includeDefaultNamespaces, withTranslation } from "services/i18n"
import FormikElement, { IBaseFormikProps } from "./FormikElement"

interface IProps extends IBaseFormikProps {
  className: string
  name: string
  placeholder?: string
  type?: InputType
}

class FormikInput extends FormikElement<IProps> {
  public render = () => {
    // extract all properties not allowed / not needed for the input element so the don't get
    // passed down and appear in the HTML
    const { children, field, form, help, i18n, label, meta, placeholder, t, tReady, type, ...props } = this.props
    const labelText = this.labelText()

    return <FormGroup>
      {labelText.length > 0 && <Label for={field.name}>{labelText}</Label>}

      {this.helpElement()}

      <Input
        {...field}
        {...props}
        id={field.name}
        invalid={this.hasError()}
        placeholder={placeholder ? t(placeholder) : null}
        type={type || "text"}
      />

      {this.errorElement()}
    </FormGroup>
  }
}

export default withTranslation(includeDefaultNamespaces())(FormikInput)
