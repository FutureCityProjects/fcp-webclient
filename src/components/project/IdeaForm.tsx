import { Form, Formik, getIn } from "formik"
import { WithTranslation } from "next-i18next"
import React from "react"
import { Button, FormGroup, Spinner } from "reactstrap"

import { IProject } from "api/schema"
import FormikInput from "components/common/FormikInput"
import { withTranslation } from "services/i18n"

interface IProps extends WithTranslation {
  onSubmit: any
  idea: IProject
}

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

const IdeaForm = ({ onSubmit, idea, t }: IProps) => {
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
      return (
        <Form onSubmit={handleSubmit}>
          {getIn(errors, "_error") && <p className="text-danger">Form Error: {t(getIn(errors, "_error"))}</p>}
          <div>
            <FormikInput
              help="Was willst du erreichen? Was soll getan werden?"
              label=""
              name="shortDescription"
              placeholder="Kurze Beschreibung, 10-280 Zeichen"
              required
              type="textarea"
              value={values.shortDescription}
            />
          </div>
          <FormGroup>
            <Button type="submit" disabled={isSubmitting}>
              Absenden {isSubmitting && <Spinner />}
            </Button>
          </FormGroup>
        </Form>
      )
    }}
  </Formik>
}

export default withTranslation(["common", "_error"])(IdeaForm)
