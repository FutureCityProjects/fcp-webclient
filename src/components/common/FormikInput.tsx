import { useField } from "formik"
import { WithTranslation } from "next-i18next"
import React, { InputHTMLAttributes } from "react"
import { FormGroup, Input, Label } from "reactstrap"
import { InputType } from "reactstrap/lib/Input"

import { withTranslation } from "services/i18n"

interface IProps extends InputHTMLAttributes<HTMLInputElement>, WithTranslation {
  help?: string
  name: string
  label?: string
  t: any
  type?: InputType
  value: string
}

const FormikInput: React.FC<IProps> = ({ t, i18n, tReady, ...props }: IProps) => {
  const [field, meta] = useField(props)
  const hasError = meta.error && typeof meta.error === "string"

  // render no <label> when an empty label was provided,
  // if no label was given fallback to the element name
  const label = typeof props.label === "undefined"
    ? field.name.charAt(0).toUpperCase() + field.name.slice(1)
    : props.label

  return (
    <FormGroup>
      {label.length > 0 && <Label for={field.name}>{label}{typeof props.required !== "undefined" && <> *</>}</Label>}

      {props.help && <div className="form-text text-muted">
        {props.help}
      </div>}

      <Input
        {...field}
        {...props}
        id={field.name}
        invalid={hasError}
        type={props.type || "text"}
      />

      {hasError && <div className="invalid-feedback was-validated">{t(meta.error)}</div>}
    </FormGroup>
  )
}

export default withTranslation(["_error"])(FormikInput)
