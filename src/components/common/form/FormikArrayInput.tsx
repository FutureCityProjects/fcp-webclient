import React from "react"
import { Input, InputGroup } from "reactstrap"
import { InputType } from "reactstrap/lib/Input"

import Icon from "components/common/Icon"
import { includeDefaultNamespaces, withTranslation } from "services/i18n"
import FormikElement, { IBaseFormikProps } from "./FormikElement"

interface IProps extends IBaseFormikProps {
  className: string
  name: string
  onRemove: any
  placeholder?: string
  type?: InputType
}

class FormikArrayInput extends FormikElement<IProps> {
  public render = () => {
    // extract all properties not allowed / not needed for the input element so the don't get
    // passed down and appear in the HTML
    const { children, field, form, i18n, id, meta, onRemove, placeholder, t, tReady, type, ...props } = this.props

    return <InputGroup>
      <Input
        {...field}
        {...props}
        id={id || field.name}
        name={field.name}
        invalid={this.hasError()}
        placeholder={placeholder ? t(placeholder) : null}
        type={type || "text"}
      />
      <div className="icon-navigation input-group-addon">
        <a className="navigation-item"
          onClick={onRemove}
          title={t("form.removeElement")}
        ><Icon name="trash" size={18} /></a>
      </div>

      {this.errorElement()}
    </InputGroup>
  }
}

export default withTranslation(includeDefaultNamespaces())(FormikArrayInput)
