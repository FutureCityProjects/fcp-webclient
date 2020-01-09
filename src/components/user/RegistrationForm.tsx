import { Form, Formik, getIn } from "formik"
import { WithTranslation } from "next-i18next"
import React from "react"
import { Button, FormGroup, Spinner } from "reactstrap"

import { IUser } from "api/schema"
import FormikInput from "components/common/FormikInput"
import { withTranslation } from "services/i18n"

interface IProps extends WithTranslation {
  onSubmit: any
}

const validate = (values: IUser) => {
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

  return errors
}

const emptyUser: IUser = {
  email: "",
  password: "",
  username: "",
}

/**
 * @todo confirmPassword
 * @todo accept AGB
 * @todo accept Datenschutz
 *
 * @param IProps
 */
const RegistrationForm = ({ onSubmit, t }: IProps) => {
  return <Formik<IUser>
    initialValues={emptyUser}
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
            help="Mit diesem Namen werden dich andere Benutzer auf der Plattform sehen @todo Sonderzeichen @todo Länge"
            label="Benutzername"
            name="username"
            placeholder="Eindeutiger Benutzername"
            required
            type="text"
            value={values.username}
          />
          <FormikInput
            help="An diese Adresse senden wir Benachrichtigungen zu deinen Projekten."
            label="Email-Adresse"
            name="email"
            placeholder="email@domain.de"
            required
            type="email"
            value={values.email}
          />
          <FormikInput
            help="@todo min länge"
            label="Passwort"
            name="password"
            placeholder="Dein geheimes Passwort"
            required
            type="password"
            value={values.password}
          />
          <FormGroup>
            <Button type="submit" disabled={isSubmitting}>
              Registrieren {isSubmitting && <Spinner />}
            </Button>
          </FormGroup>
        </Form>
      )
    }}
  </Formik>
}

export default withTranslation(["common", "_error"])(RegistrationForm)
