import { FieldArray, Form, Formik, getIn } from "formik"
import React from "react"
import { Button, FormGroup, Spinner } from "reactstrap"

import { IProcess } from "api/schema"
import FormikFieldArray from "components/common/FormikFieldArray"
import FormikInput from "components/common/FormikInput"
import FormikRTE from "components/common/FormikRTE"

interface IProps {
  onSubmit: any
  process?: IProcess
}

const ProcessForm = ({ onSubmit, process = {
  criteria: null,
  description: "",
  imprint: "",
  name: "",
  region: "",
  targets: [],
} }: IProps) => {
  return <Formik<IProcess> initialValues={process} onSubmit={onSubmit}>
    {({
      errors,
      handleReset,
      handleSubmit,
      isSubmitting,
      values,
    }) => {
      return (
        <Form onSubmit={handleSubmit}>
          {getIn(errors, "_error") && <p className="text-danger">{getIn(errors, "_error")}</p>}
          <div>
            <FormikInput name="name" required value={values.name} />
          </div>
          <div>
            <FormikRTE label="Beschreibung" name="description" required value={values.description} />
          </div>
          <div>
            <FormikInput name="region" required value={values.region} />
          </div>
          <FieldArray
            name="targets"
            component={FormikFieldArray}
          />
          <FieldArray
            name="criteria"
            component={FormikFieldArray}
          />
          <div>
            <FormikRTE name="imprint" required value={values.imprint} />
          </div>
          <FormGroup>
            <Button type="submit" disabled={isSubmitting}>
              Submit {isSubmitting && <Spinner />}
            </Button>
            &nbsp;
            <Button type="button" disabled={isSubmitting} onClick={handleReset}>
              Clear Values
            </Button>
          </FormGroup>
        </Form>
      )
    }}
  </Formik>
}

export default ProcessForm
