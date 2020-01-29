import { Field, Form, Formik } from "formik"
import React from "react"
import { Button, FormGroup, Spinner } from "reactstrap"

import { ICredentials } from "api/schema"
import FormikInput from "components/common/form/FormikInput"
import GeneralFormError from "components/common/form/GeneralFormError"
import { useTranslation } from "services/i18n"

interface IProps {
  onSubmit: any
  credentials?: ICredentials
}

const LoginForm = ({ onSubmit, credentials = {
  password: "",
  username: "",
} }: IProps) => {
  const { t } = useTranslation()

  return <Formik<ICredentials> initialValues={credentials} onSubmit={onSubmit}>
    {({
      errors,
      handleSubmit,
      isSubmitting,
      values,
    }) => {
      return <Form onSubmit={handleSubmit}>
        <GeneralFormError errors={errors} values={values} />
        <Field component={FormikInput}
          help="form.login.username.help"
          label="form.login.username.label"
          name="username"
          placeholder="form.login.username.placeholder"
          required
          value={values.username}
        />

        <Field component={FormikInput}
          help="form.login.password.help"
          label="form.login.password.label"
          name="password"
          placeholder="form.login.password.placeholder"
          required
          type="password"
          value={values.password}
        />

        <FormGroup>
          <Button color="primary" type="submit" disabled={isSubmitting}>
            {t("form.login.submit")} {isSubmitting && <Spinner />}
          </Button>
        </FormGroup>
      </Form>
    }}
  </Formik>
}

export default LoginForm
