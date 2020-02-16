import { Field, Form, Formik } from "formik"
import React from "react"
import { Button, Spinner } from "reactstrap"

import { IFundApplication } from "api/schema"
import FormikInput from "components/common/form/FormikInput"
import GeneralFormError from "components/common/form/GeneralFormError"
import Icon from "components/common/Icon"
import { useTranslation } from "services/i18n"

interface IProps {
  application?: IFundApplication
  onSubmit: any
}

const FundingForm = ({ application, onSubmit }: IProps) => {
  const { t } = useTranslation()

  return <Formik<IFundApplication> initialValues={application} onSubmit={onSubmit}>
    {({
      errors,
      handleSubmit,
      isSubmitting,
      values,
    }) => <Form onSubmit={handleSubmit}>
        <GeneralFormError
          errors={errors}
          prefix="fundAppliaction"
          excludeFields={["requestedFunding"]}
        />

        <Field component={FormikInput}
          help="form.fundApplication.requestedFunding.help"
          label="fundApplication.requestedFunding"
          name="requestedFunding"
          placeholder="form.fundApplication.requestedFunding.placeholder"
          min="0"
          max="99999999"
          step="1"
          type="number"
          value={values.requestedFunding}
        />

        <div className="button-area">
          <Button className="btn-action btn-icon" type="submit" color="primary" disabled={isSubmitting}>
            <Icon name="save" size={18} />
            {t("form.saveChanges")} {isSubmitting && <Spinner />}
          </Button>
        </div>
      </Form>
    }
  </Formik>
}

export default FundingForm
