import React from "react"
import { FormGroup, Label } from "reactstrap"

import { SelfAssessment } from "api/schema"
import RangeSlider from "components/common/RangeSlider"
import { includeDefaultNamespaces, withTranslation } from "services/i18n"
import FormikElement, { IBaseFormikProps } from "./FormikElement"

interface IProps extends IBaseFormikProps {
  value: SelfAssessment
  labels: object,
}

class FormikRange extends FormikElement<IProps> {
  public render() {
    const { field, form, labels, value } = this.props
    const labelText = this.labelText()

    return <FormGroup>
      {labelText.length > 0 && <Label for={field.name}>{labelText}</Label>}

      {this.helpElement()}

      <RangeSlider
        labels={labels}
        onChange={(val) => form.setFieldValue(field.name, val)}
        value={value}
      />

      {this.errorElement()}
    </FormGroup>
  }
}

export default withTranslation(includeDefaultNamespaces())(FormikRange)
