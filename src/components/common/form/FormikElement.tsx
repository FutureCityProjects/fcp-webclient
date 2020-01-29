import { WithTranslation } from "next-i18next"
import React from "react"

import { FieldProps } from "formik"
import { FormText } from "reactstrap"
import TranslatedHtml from "../TranslatedHtml"

export interface IBaseFormikProps extends FieldProps, WithTranslation {
  help?: string
  label?: string
  name: string
  required?: boolean
}

abstract class FormikElement<Props extends IBaseFormikProps> extends React.Component<Props> {
  protected meta = () => this.props.form.getFieldMeta(this.props.field.name)
  protected hasError = (): boolean => this.meta().error && typeof this.meta().error === "string"

  protected labelText(): string {
    // render no <label> when an empty label was provided,
    // if no label was given fallback to the element name
    let label = typeof this.props.label === "undefined"
      ? this.props.field.name.charAt(0).toUpperCase() + this.props.field.name.slice(1)
      : this.props.label

    // translate now, maybe a translation string was given but the translation was empty
    // -> don't show
    if (label.length > 0) {
      label = this.props.t(label)
    }

    if (label.length > 0 && this.props.required) {
      label = label + " *"
    }

    return label
  }

  protected errorElement = () => this.hasError() && <div className="invalid-feedback was-validated">
    <TranslatedHtml content={"_error:" + this.meta().error} />
  </div>

  protected helpElement = () => this.props.help && <FormText>
    <TranslatedHtml content={this.props.help} />
  </FormText>
}

export default FormikElement
