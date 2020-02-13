import { Field, Form, Formik } from "formik"
import React from "react"
import { Button, FormGroup, Spinner } from "reactstrap"

import { IProjectMembership } from "api/schema"
import FormikInput from "components/common/form/FormikInput"
import GeneralFormError from "components/common/form/GeneralFormError"
import Icon from "components/common/Icon"
import { useTranslation } from "services/i18n"

interface IProps {
  application: IProjectMembership
  onSubmit: any
}

const validate = (values: IProjectMembership) => {
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

const MemberApplicationForm = ({ application, onSubmit }: IProps) => {
  const { t } = useTranslation()

  return <Formik<IProjectMembership>
    initialValues={application}
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
          help="form.project.apply.motivation.help"
          label="form.project.apply.motivation.label"
          name="motivation"
          placeholder="form.project.apply.motivation.placeholder"
          required
          type="textarea"
          value={values.motivation}
        />

        <Field component={FormikInput}
          help="form.project.apply.skills.help"
          label="form.project.apply.skills.label"
          name="skills"
          placeholder="form.project.apply.skills.placeholder"
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

export default MemberApplicationForm
