import { Field, Form, Formik } from "formik"
import React from "react"
import { Button, FormGroup, Spinner } from "reactstrap"

import { IFundApplication, IFundConcretization } from "api/schema"
import FormikInput from "components/common/form/FormikInput"
import FormikRTE from "components/common/form/FormikRTE"
import GeneralFormError from "components/common/form/GeneralFormError"
import { useTranslation } from "services/i18n"

interface IProps {
  onSubmit: any
  application?: IFundApplication
}

const ProjectConcretizationForm = ({ onSubmit, application = {
  description: "",
  maxLength: 280,
  question: ""
} }: IProps) => {
  const { t } = useTranslation()

  return <Formik<IFundConcretization> initialValues={concretization} onSubmit={onSubmit}>
    {({
      errors,
      handleSubmit,
      isSubmitting,
      values,
    }) => {
      return (
        <Form onSubmit={handleSubmit}>
          <GeneralFormError errors={errors} values={values} />

          <Field component={FormikInput}
            help="form.fundConcretization.question.help"
            label="fundConcretization.question"
            name="question"
            maxLength={1000}
            placeholder="form.fundConcretization.question.placeholder"
            required
            value={values.question}
          />

          <Field component={FormikRTE}
            help="form.fundConcretization.description.help"
            label="fundConcretization.description"
            name="description"
            placeholder="form.fundConcretization.description.placeholder"
            required
            value={values.description}
          />

          <Field component={FormikInput}
            help="form.fundConcretization.maxLength.help"
            label="fundConcretization.maxLength"
            name="maxLength"
            maxLength={4}
            placeholder="form.fundConcretization.maxLength.placeholder"
            required
            type="number"
            value={values.maxLength}
          />

          <FormGroup>
            <Button color="primary" type="submit" disabled={isSubmitting}>
              {t("form.submit")} {isSubmitting && <Spinner />}
            </Button>
          </FormGroup>

          <p className="text-danger">{t("form.requiredFieldsHint")}</p>
        </Form>
      )
    }}
  </Formik>
}

export default ProjectConcretizationForm
