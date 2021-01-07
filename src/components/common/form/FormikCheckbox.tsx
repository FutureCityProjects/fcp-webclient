import React from "react"
import { FormGroup, Input, Label } from "reactstrap"

import { includeDefaultNamespaces, withTranslation } from "services/i18n"
import FormikElement, { IBaseFormikProps } from "./FormikElement"

interface IProps extends IBaseFormikProps {
  className: string
  help?: string
  name: string
  label?: string
  checked?: boolean
}

class FormikCheckbox extends FormikElement<IProps> {
  public render = () => {
    // extract all properties not allowed / not needed for the input element so the don't get
    // passed down and appear in the HTML with the rest of the props
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const { children, field, form, help, i18n, id, label, meta, t, tReady, ...props } = this.props
    const labelText = this.labelText()

    return (
      <FormGroup className="form-check">
        <Label check>
          <Input
            {...field}
            {...props}
            id={id || field.name}
            name={field.name}
            invalid={this.hasError()}
            value="true"
            type="checkbox"
          />

          {labelText}

          {/* @todo error has to be within the label to be displayed because
            .was-validated only works next to the invalid element */}
          {this.errorElement()}
        </Label>

        {this.helpElement()}
      </FormGroup>
    )
  }
}

export default withTranslation(includeDefaultNamespaces())(FormikCheckbox)
