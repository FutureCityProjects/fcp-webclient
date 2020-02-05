import { Field, Form, Formik } from "formik"
import React, { useEffect } from "react"
import { Button, Card, CardBody, CardHeader, FormGroup, Spinner } from "reactstrap"

import FormikInput from "components/common/form/FormikInput"
import GeneralFormError from "components/common/form/GeneralFormError"
import { useTranslation } from "services/i18n"

interface IProps {
  bindErrorHandler: any
  id?: string
  onSubmit: any
  token?: string
}

const ValidationForm = ({ bindErrorHandler, id = "", onSubmit, token = "" }: IProps) => {
  const { t } = useTranslation()

  return <Formik<{ id: string, token: string }> initialValues={{ id, token }} onSubmit={onSubmit}>
    {({
      errors,
      handleSubmit,
      isSubmitting,
      setErrors,
      values,
    }) => {

      // allow the parent page to inject errors
      useEffect(() => {
        bindErrorHandler(setErrors)
      }, [])

      const err = <GeneralFormError errors={errors} values={values} />

      return <Form onSubmit={handleSubmit}>
        <Card>
          {err && <CardBody>{err}</CardBody>}

          <CardHeader>{t("form.validation.header")}</CardHeader>
          <CardBody>

            <Field component={FormikInput}
              help="form.validation.id.help"
              label="form.validation.id.label"
              name="id"
              placeholder="form.validation.id.placeholder"
              required
              value={values.id || ""}
            />

            <Field component={FormikInput}
              help="form.validation.token.help"
              label="form.validation.token.label"
              name="token"
              placeholder="form.validation.token.placeholder"
              required
              value={values.token || ""}
            />

            <FormGroup>
              <Button className="btn-action" color="primary" type="submit" disabled={isSubmitting}>
                {t("form.submit")} {isSubmitting && <Spinner />}
              </Button>
            </FormGroup>

            <p className="text-danger">{t("form.requiredFieldsHint")}</p>
          </CardBody>
        </Card>
      </Form>
    }}
  </Formik>
}

export default ValidationForm
