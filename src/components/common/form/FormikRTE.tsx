import dynamic from "next/dynamic"
import React from "react"
import { FormGroup, Label } from "reactstrap"

import { includeDefaultNamespaces, withTranslation } from "services/i18n"
import FormikElement, { IBaseFormikProps } from "./FormikElement"

interface IProps extends IBaseFormikProps {
  maxLength?: number
  placeholder?: string
  value: string
}

// don't render the editor server-side, reactQuill doesn't support it and
// our componentDidMount hook requires the DOM too...
const RTE = dynamic(() => import('./RTE'), {
  ssr: false,
})

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
          id={this.props.id || field.name}
          maxLength={this.props.maxLength}
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
