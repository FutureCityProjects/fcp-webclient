import React from "react"
import { Input, InputGroup } from "reactstrap"
import { InputType } from "reactstrap/lib/Input"

import { includeDefaultNamespaces, withTranslation } from "services/i18n"
import FormikElement, { IBaseFormikProps } from "./FormikElement"

interface IProps extends IBaseFormikProps {
  addOn: any
  className: string
  name: string
  onRemove: any
  placeholder?: string
  type?: InputType
  value?: any
}

class FormikArrayInput extends FormikElement<IProps> {
  public render = () => {
    // extract all properties not allowed / not needed for the input element so the don't get
    // passed down and appear in the HTML
    const { addOn, children, field, form, i18n, id, meta, onRemove,
      placeholder, t, tReady, type, value, ...props } = this.props

    return <InputGroup>
      <Input
        {...field}
        {...props}
        id={id || field.name}
        name={field.name}
        invalid={this.hasError()}
        placeholder={placeholder ? t(placeholder) : null}
        type={type || "text"}
        value={value === null ? "" : value}
      />
      {addOn}

      {this.errorElement()}
    </InputGroup>
  }
}

export default withTranslation(includeDefaultNamespaces())(FormikArrayInput)
