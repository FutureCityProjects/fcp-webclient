import { useField } from "formik"
import React, { InputHTMLAttributes } from "react"
import { FormGroup, Label } from "reactstrap"

import RTE from "./RTE"

interface IProps extends InputHTMLAttributes<HTMLInputElement> {
  name: string
  label?: string
  value: string
}

const FormikRTE: React.FC<IProps> = ({ label, ...props }: IProps) => {
  const [field, meta] = useField(props)
  return (
    <FormGroup>
      <Label for={field.name}>{label || field.name}{typeof props.required !== "undefined" && <> *</>}</Label>
      <div className="d-block">
        <RTE value={props.value || ""} onChange={field.onChange(field.name)} />
      </div>
      {meta.error && typeof meta.error === "string" && <p className="text-danger">{meta.error}</p>}
    </FormGroup>
  )
}

export default FormikRTE
