import { Form, Formik } from "formik"
import React from "react"
import { Button, FormGroup, Spinner } from "reactstrap"

import GeneralFormError from "components/common/form/GeneralFormError"
import { useTranslation } from "services/i18n"

interface IProps {
  buttonLabel?: string
  onSubmit: any
}

const ConfirmationForm = ({ buttonLabel, onSubmit }: IProps) => {
  const { t } = useTranslation()

  return <Formik initialValues={{}} onSubmit={onSubmit}>
    {({
      errors,
      handleSubmit,
      isSubmitting,
    }) => <Form onSubmit={handleSubmit}>
        <GeneralFormError errors={errors} />

        <FormGroup>
          <Button className="btn-action" color="primary" type="submit" disabled={isSubmitting}>
            {t(buttonLabel || "form.confirm")} {isSubmitting && <Spinner />}
          </Button>
        </FormGroup>
      </Form>
    }
  </Formik>
}

export default ConfirmationForm