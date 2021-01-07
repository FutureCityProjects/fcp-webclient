import { Field, Form, Formik } from "formik"
import React, { ReactElement } from "react"
import { Button, FormGroup, Spinner } from "reactstrap"

import { ICredentials } from "api/schema"
import FormikInput from "components/common/form/FormikInput"
import GeneralFormError from "components/common/form/GeneralFormError"
import Icon from "components/common/Icon"
import { useTranslation } from "services/i18n"

interface IProps {
  onSubmit: any
  credentials?: ICredentials
}

const LoginForm = ({ onSubmit, credentials = {
  password: "",
  username: "",
} }: IProps): ReactElement => {
  const { t } = useTranslation()

  return <Formik<ICredentials> initialValues={credentials} onSubmit={onSubmit}>
    {({
      errors,
      handleSubmit,
      isSubmitting,
      values,
    }) => <Form onSubmit={handleSubmit}>
        <GeneralFormError
          errors={errors}
          prefix="user"
          excludeFields={["password", "username"]}
        />
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
          <Button className="btn-action btn-icon" type="submit" color="primary" disabled={isSubmitting}>
            <Icon name="user" size={18} />
            {t("form.login.submit")} {isSubmitting && <Spinner />}
          </Button>
        </FormGroup>
      </Form>
    }
  </Formik>
}

export default LoginForm
