import { FieldArrayRenderProps, getIn } from "formik"
import React from "react"
import { Button, FormGroup, Label } from "reactstrap"

import FormikInput from "./FormikInput"

interface IProps extends FieldArrayRenderProps {
  label?: string
  name: string
}

const FormikFieldArray = ({
  push, form, remove, label, name,
}: IProps) => {
  const values = getIn(form, ["values", name])
  const error = getIn(form, ["errors", name])

  return (
    <FormGroup row={false}>
      <Label>{label || name}</Label>
      {values && values.length > 0 && values.map((value, index) => (
        <div key={index}>
          <FormikInput name={`${name}.${index}`} value={value} />
          <Button
            title={`Remove ${name}`}
            onClick={() => remove(index)}
          >Remove</Button>
        </div>
      ))}

      <br />
      <Button onClick={() => push("")}>
        {`Add ${name}`}
      </Button>
      {error && typeof error === "string" && <p className="text-danger">{error}</p>}
    </FormGroup>
  )
}

export default FormikFieldArray
