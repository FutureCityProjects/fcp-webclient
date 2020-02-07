import { Field, Form, Formik } from "formik"
import React from "react"
import { Button, FormGroup, Spinner } from "reactstrap"

import { IProjectCreation } from "api/schema"
import FormikInput from "components/common/form/FormikInput"
import GeneralFormError from "components/common/form/GeneralFormError"
import Icon from "components/common/Icon"
import { useTranslation } from "services/i18n"

interface IProps {
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

const ProjectCreationForm = ({ onSubmit, project }: IProps) => {
  const { t } = useTranslation()

  return <Formik<IProjectCreation>
    initialValues={project}
    onSubmit={onSubmit}
    validate={validate}
    validateOnBlur={false}
    validateOnChange={false}
  >
    {({
      errors,
      handleSubmit,
      isSubmitting,
      values,
    }) => <Form onSubmit={handleSubmit}>
        <GeneralFormError errors={errors} prefix="user" values={values} />

        <Field component={FormikInput}
          help="form.project.create.motivation.help"
          label="form.project.create.motivation.label"
          name="motivation"
          placeholder="form.project.create.motivation.placeholder"
          required
          type="textarea"
          value={values.motivation}
        />

        <Field component={FormikInput}
          help="form.project.create.skills.help"
          label="form.project.create.skills.label"
          name="skills"
          placeholder="form.project.create.skills.placeholder"
          required
          type="textarea"
          value={values.skills}
        />

        <FormGroup>
          <Button className="btn-action btn-icon" type="submit" color="primary" disabled={isSubmitting}>
            <Icon name="save" size={18} />
            {t("form.submit")} {isSubmitting && <Spinner />}
          </Button>
        </FormGroup>

        <p className="text-danger">{t("form.requiredFieldsHint")}</p>
      </Form>
    }
  </Formik>
}

export default ProjectCreationForm
