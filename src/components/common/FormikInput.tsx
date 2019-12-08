import { useField } from "formik"
import React, { InputHTMLAttributes } from "react"
import { FormGroup, Input, Label } from "reactstrap"

interface IProps extends InputHTMLAttributes<HTMLInputElement> {
  name: string
  label?: string
  value: string
}

const FormikInput: React.FC<IProps> = ({ label, ...props }: IProps) => {
  const [field, meta] = useField(props)

  return (
    <FormGroup>
      <Label for={field.name}>{field.name}{typeof props.required !== "undefined" && <> *</>}</Label>
      <Input {...field} {...props} id={field.name} type="text" />
      {meta.error && typeof meta.error === "string" && <p className="text-danger">{meta.error}</p>}
    </FormGroup>
  )
}

export default FormikInput
