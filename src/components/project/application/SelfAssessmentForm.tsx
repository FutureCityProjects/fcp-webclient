import { Field, Form, Formik } from "formik"
import React from "react"
import { Button, Card, CardBody, CardHeader, Spinner } from "reactstrap"

import { IFundApplication, SelfAssessment } from "api/schema"
import FormikRange from "components/common/form/FormikRange"
import GeneralFormError from "components/common/form/GeneralFormError"
import Icon from "components/common/Icon"
import { useTranslation } from "services/i18n"

interface IProps {
  application: IFundApplication
  onSubmit: any
}

const SelfAssessmentForm: React.FC<IProps> = (props: IProps) => {
  const { application, onSubmit } = props
  const { t } = useTranslation()

  return <Card className="body-card">
    <CardHeader>
      <h3>{t("fundApplication.applicationSelfAssessment")}</h3>
    </CardHeader>
    <CardBody>
      <Formik<IFundApplication>
        initialValues={application}
        onSubmit={onSubmit}
      >
        {({
          errors,
          handleSubmit,
          isSubmitting,
          values,
        }) => <Form onSubmit={handleSubmit}>
            <GeneralFormError
              errors={errors}
              prefix="fundApplication"
              excludeFields={["applicationSelfAssessment"]}
            />

            <Field component={FormikRange}
              help="form.fundApplication.applicationSelfAssessment.help"
              label=""
              name="applicationSelfAssessment"
              labels={{
                [SelfAssessment.Starting]: t("progress.0"),
                [SelfAssessment.MakingProgress]: t("progress.25"),
                [SelfAssessment.HalfFinished]: t("progress.50"),
                [SelfAssessment.AlmostFinished]: t("progress.75"),
                [SelfAssessment.Complete]: t("progress.100"),
              }}
              value={values.applicationSelfAssessment}
            />
            <div className="button-area">
              {values.applicationSelfAssessment !== application.applicationSelfAssessment
                ? <Button className="btn-icon" type="submit" color="primary" disabled={isSubmitting}>
                  <Icon name="save" size={18} />
                  {t("form.saveChanges")} {isSubmitting && <Spinner />}
                </Button>
                : ""
              }
            </div>
          </Form>
        }
      </Formik>
    </CardBody>
  </Card >
}

export default SelfAssessmentForm
