import { Field, FieldArray, Form, Formik } from "formik"
import React from "react"
import { Button, Card, CardBody, CardHeader, FormGroup, Spinner } from "reactstrap"

import { IProcess } from "api/schema"
import FormikInput from "components/common/form/FormikInput"
import FormikRTE from "components/common/form/FormikRTE"
import GeneralFormError from "components/common/form/GeneralFormError"
import { useTranslation } from "services/i18n"
import CriteriaArray from "./CriteriaArray"
import GoalsArray from "./GoalsArray"

interface IProps {
  onSubmit: any
  process?: IProcess
}

const ProcessForm = ({ onSubmit, process = {
  criteria: null,
  description: "",
  goals: [],
  imprint: "",
  name: "",
  region: "",
} }: IProps) => {
  const { t } = useTranslation()

  return <Formik<IProcess> initialValues={process} onSubmit={onSubmit}>
    {({
      errors,
      handleSubmit,
      isSubmitting,
      values,
    }) => {
      return (
        <Form onSubmit={handleSubmit}>
          <Card>
            <CardHeader>{t("form.process.header")}</CardHeader>
            <CardBody>
              <GeneralFormError errors={errors} values={values} />

              <Field component={FormikInput}
                help="form.process.name.help"
                label="process.name"
                name="name"
                placeholder="form.process.name.placeholder"
                required
                value={values.name}
              />

              <Field component={FormikRTE}
                help="form.process.description.help"
                label="process.description"
                name="description"
                placeholder="form.process.description.placeholder"
                required
                value={values.description}
              />

              <Field component={FormikInput}
                help="form.process.region.help"
                label="process.region"
                name="region"
                placeholder="process.fund.region.placeholder"
                required
                value={values.region}
              />

              <FieldArray
                name="goals"
                component={GoalsArray}
              />

              <FieldArray
                name="criteria"
                component={CriteriaArray}
              />

              <Field component={FormikRTE}
                help="form.process.imprint.help"
                label="process.imprint"
                name="imprint"
                placeholder="form.process.imprint.placeholder"
                required
                value={values.imprint}
              />

              <FormGroup>
                <Button color="primary" type="submit" disabled={isSubmitting}>
                  {t("form.submit")} {isSubmitting && <Spinner />}
                </Button>
              </FormGroup>

              <p className="text-danger">{t("form.requiredFieldsHint")}</p>
            </CardBody>
          </Card>
        </Form>
      )
    }}
  </Formik>
}

export default ProcessForm
