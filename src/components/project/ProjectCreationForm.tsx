import { Form, Formik, getIn } from "formik"
import { WithTranslation } from "next-i18next"
import React from "react"
import { Button, FormGroup, Spinner } from "reactstrap"

import { IProjectCreation } from "api/schema"
import FormikInput from "components/common/FormikInput"
import { withTranslation } from "services/i18n"

interface IProps extends WithTranslation {
  onSubmit: any
  project: IProjectCreation
}

const validate = (values: IProjectCreation) => {
  const errors: { [key: string]: string } = {}

  if (!values.motivation) {
    errors.motivation = "validate.general.notBlank"
  } else if (values.motivation.length < 10) {
    errors.motivation = "validate.general.tooShort"
  } else if (values.motivation.length > 1000) {
    errors.motivation = "validate.general.tooLong"
  }

  if (!values.skills) {
    errors.skills = "validate.general.notBlank"
  } else if (values.skills.length < 10) {
    errors.skills = "validate.general.tooShort"
  } else if (values.skills.length > 1000) {
    errors.skills = "validate.general.tooLong"
  }

  return errors
}

const ProjectCreationForm = ({ onSubmit, project, t }: IProps) => {
  return <Formik<IProjectCreation>
    initialValues={project}
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
          <FormikInput
            help="Was motiviert dich diese Idee umzusetzen?"
            label="Motivation"
            name="motivation"
            placeholder="mindestens 10 Zeichen"
            required
            type="textarea"
            value={values.motivation}
          />
          <FormikInput
            help="Welche deiner Fähigkeiten willst du in das neue Projekt einbringen?"
            label="Fähigkeiten"
            name="skills"
            placeholder="mindestens 10 Zeichen"
            required
            type="textarea"
            value={values.skills}
          />
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

export default withTranslation(["common", "_error"])(ProjectCreationForm)
