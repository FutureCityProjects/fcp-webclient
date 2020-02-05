import { Field, Form, Formik } from "formik"
import React from "react"
import { Button, FormGroup, Spinner } from "reactstrap"

import { IUser } from "api/schema"
import FormikCheckbox from "components/common/form/FormikCheckbox"
import FormikInput from "components/common/form/FormikInput"
import GeneralFormError from "components/common/form/GeneralFormError"
import { useTranslation } from "services/i18n"

interface IRegistrationData extends IUser {
  acceptTerms: boolean
  repeatPassword: string
}

const emptyUser: IRegistrationData = {
  acceptTerms: false,
  email: "",
  firstName: "",
  lastName: "",
  password: "",
  repeatPassword: "",
  username: "",
}

const validate = (values: IRegistrationData) => {
  const errors: { [key: string]: string } = {}

  if (!values.email) {
    errors.email = "validate.general.notBlank"
  }

  if (!values.username) {
    errors.username = "validate.general.notBlank"
  } else if (values.username.length < 2) {
    errors.username = "validate.general.tooShort"
  } else if (values.username.length > 20) {
    errors.username = "validate.general.tooLong"
  }

  if (!values.password) {
    errors.password = "validate.general.notBlank"
  } else if (values.password.length < 6) {
    errors.password = "validate.general.tooShort"
  } else if (values.password.length > 200) {
    errors.password = "validate.general.tooLong"
  }

  if (!values.repeatPassword) {
    errors.repeatPassword = "validate.general.notBlank"
  } else if (values.password !== values.repeatPassword) {
    errors.repeatPassword = "validate.user.repeatPassword.notMatching"
  }

  if (!values.repeatPassword) {
    errors.repeatPassword = "validate.general.notBlank"
  } else if (values.password !== values.repeatPassword) {
    errors.repeatPassword = "validate.user.repeatPassword.notMatching"
  }

  if (!values.acceptTerms) {
    errors.acceptTerms = "validate.registration.acceptTerms"
  }

  return errors
}

interface IProps {
  onSubmit: any
}

const RegistrationForm = ({ onSubmit }: IProps) => {
  const { t } = useTranslation()

  return <Formik<IRegistrationData>
    initialValues={emptyUser}
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
        <GeneralFormError errors={errors} values={values} />

        <Field component={FormikInput}
          help="form.registration.username.help"
          label="form.registration.username.label"
          name="username"
          placeholder="form.registration.username.placeholder"
          required
          value={values.username}
        />

        <Field component={FormikInput}
          help="form.registration.firstName.help"
          label="form.registration.firstName.label"
          name="firstName"
          placeholder="form.registration.firstName.placeholder"
          required
          value={values.firstName}
        />

        <Field component={FormikInput}
          help="form.registration.lastName.help"
          label="form.registration.lastName.label"
          name="lastName"
          placeholder="form.registration.lastName.placeholder"
          required
          value={values.lastName}
        />

        <Field component={FormikInput}
          help="form.registration.email.help"
          label="form.registration.email.label"
          name="email"
          placeholder="form.registration.email.placeholder"
          required
          type="email"
          value={values.email}
        />

        <Field component={FormikInput}
          help="form.registration.password.help"
          label="form.registration.password.label"
          name="password"
          placeholder="form.registration.password.placeholder"
          required
          type="password"
          value={values.password}
        />

        <Field component={FormikInput}
          help="form.registration.repeatPassword.help"
          label="form.registration.repeatPassword.label"
          name="repeatPassword"
          placeholder="form.registration.repeatPassword.placeholder"
          required
          type="password"
          value={values.repeatPassword}
        />

        <Field component={FormikCheckbox}
          help="form.registration.acceptTerms.help"
          label="form.registration.acceptTerms.label"
          name="acceptTerms"
          checked={values.acceptTerms}
        />

        <FormGroup>
          <Button className="btn-action btn-icon" type="submit" color="primary" disabled={isSubmitting}>
            <Icon name="message" size={18} />
            {t("form.registration.submit")} {isSubmitting && <Spinner />}
          </Button>
        </FormGroup>

        <p className="text-danger">{t("form.requiredFieldsHint")}</p>
      </Form>
    }
  </Formik>
}

export default RegistrationForm
