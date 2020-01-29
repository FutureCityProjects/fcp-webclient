import React from "react"
import { FormGroup, Label } from "reactstrap"

import { includeDefaultNamespaces, withTranslation } from "services/i18n"
import FormikElement, { IBaseFormikProps } from "./FormikElement"
import RTE from "./RTE"

interface IProps extends IBaseFormikProps {
  placeholder?: string
  value: string
}

class FormikRTE extends FormikElement<IProps> {
  public render() {
    const { field, placeholder, value } = this.props
    const labelText = this.labelText()

    return (
      <FormGroup className="form-rte">
        {labelText.length > 0 && <Label for={field.name}>{labelText}</Label>}

        {this.helpElement()}

        <RTE
          className={this.hasError() ? "is-invalid" : ""}
          id={field.name}
          onChange={field.onChange(field.name)}
          placeholder={placeholder}
          value={value || ""}
        />

        {this.errorElement()}
      </FormGroup>
    )
  }
}

export default withTranslation(includeDefaultNamespaces())(FormikRTE)
