import { Field, Form, Formik } from "formik"
import React from "react"
import { Button, FormGroup, Spinner } from "reactstrap"

import { IProject } from "api/schema"
import FormikInput from "components/common/form/FormikInput"
import GeneralFormError from "components/common/form/GeneralFormError"
import { useTranslation } from "services/i18n"

const validate = (values: IProject) => {
  const errors: { [key: string]: string } = {}

  if (!values.shortDescription) {
    errors.shortDescription = "validate.general.notBlank"
  } else if (values.shortDescription.length < 10) {
    errors.shortDescription = "validate.general.tooShort"
  } else if (values.shortDescription.length > 280) {
    errors.shortDescription = "validate.general.tooLong"
  }

  return errors
}

interface IProps {
  onSubmit: any
  idea: IProject
}

const IdeaForm = ({ onSubmit, idea }: IProps) => {
  const { t } = useTranslation()

  return <Formik<IProject>
    initialValues={idea}
    onSubmit={onSubmit}
    validate={validate}
    validateOnChange={false}
  >
    {({
      errors,
      handleSubmit,
      isSubmitting,
      values,
    }) => {
      return <Form onSubmit={handleSubmit}>
        <GeneralFormError errors={errors} values={values} />

        <Field component={FormikInput}
          help="form.idea.shortDescription.help"
          label="form.idea.shortDescription.label"
          name="shortDescription"
          placeholder="form.idea.shortDescription.placeholder"
          required
          type="textarea"
          value={values.shortDescription}
        />

        <FormGroup>
          <Button color="primary" type="submit" disabled={isSubmitting}>
            {t("form.submit")} {isSubmitting && <Spinner />}
          </Button>
        </FormGroup>

        <p className="text-danger">{t("form.requiredFieldsHint")}</p>
      </Form>
    }}
  </Formik>
}

export default IdeaForm
