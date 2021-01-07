import de from "date-fns/locale/de"
import React from "react"
import DatePicker from "react-datepicker"
import { FormGroup, Label } from "reactstrap"

import { includeDefaultNamespaces, withTranslation } from "services/i18n"
import FormikElement, { IBaseFormikProps } from "./FormikElement"

interface IProps extends IBaseFormikProps {
  minDate?: Date
  maxDate?: Date
  value: string
  labels: Record<string, unknown>
}

class FormikDate extends FormikElement<IProps> {
  public render() {
    const { id, field, form, minDate, maxDate, value } = this.props
    const labelText = this.labelText()

    return <FormGroup>
      {labelText.length > 0 && <Label for={field.name}>{labelText}</Label>}

      {this.helpElement()}

      <DatePicker
        className="form-control"
        dateFormat="LL/y"
        id={id || field.name}
        name={field.name}
        locale={de} // @todo customize
        minDate={minDate}
        maxDate={maxDate}
        onChange={(val) => {
          form.setFieldValue(field.name, val)
        }}
        selected={(value && new Date(value)) || null}
        showMonthYearPicker
      />

      {this.errorElement()}
    </FormGroup>
  }
}

export default withTranslation(includeDefaultNamespaces())(FormikDate)
