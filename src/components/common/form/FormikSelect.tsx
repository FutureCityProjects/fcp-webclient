import React from "react"
import { FormGroup, Input, Label } from "reactstrap"

import { includeDefaultNamespaces, withTranslation } from "services/i18n"
import FormikElement, { IBaseFormikProps } from "./FormikElement"

interface IProps extends IBaseFormikProps {
  className: string
  name: string
  noGroup?: boolean
  options: { [label: string]: any }
  placeholder?: string
  value?: any
}

class FormikInput extends FormikElement<IProps> {
  public render = () => {
    // extract all properties not allowed / not needed for the input element so the don't get
    // passed down and appear in the HTML
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const { children, field, form, help, id, i18n, label, meta, noGroup = false, options, tReady,
      placeholder, t, value, ...props } = this.props
    const labelText = this.labelText()

    const optionElements = []
    Object.keys(options).forEach((optionLabel) => {
      optionElements.push(<option key={options[optionLabel]} value={options[optionLabel]}>{optionLabel}</option>)
    })

    const element = <>
      {labelText.length > 0 && <Label for={field.name}>{labelText}</Label>}

      {this.helpElement()}

      <Input
        {...field}
        {...props}
        id={id || field.name}
        name={field.name}
        invalid={this.hasError()}
        placeholder={placeholder ? t(placeholder) : null}
        type={"select"}
        value={value === null ? "" : value}
      >
        {optionElements}
      </Input>

      {this.errorElement()}
    </>

    return noGroup ? element : <FormGroup>{element}</FormGroup>
  }
}

export default withTranslation(includeDefaultNamespaces())(FormikInput)
