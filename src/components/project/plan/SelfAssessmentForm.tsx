import { Field, Form, Formik } from "formik"
import React from "react"
import { Button, Spinner } from "reactstrap"

import { IProject, SelfAssessment } from "api/schema"
import FormikRange from "components/common/form/FormikRange"
import GeneralFormError from "components/common/form/GeneralFormError"
import Icon from "components/common/Icon"
import { useTranslation } from "services/i18n"

interface IProps {
  onSubmit: any
  project: IProject
}

const SelfAssessmentForm: React.FC<IProps> = (props: IProps) => {
  const { onSubmit, project } = props
  const { t } = useTranslation()

  return <Formik
    initialValues={project}
    onSubmit={onSubmit}
  >
    {({
      errors,
      handleSubmit,
      isSubmitting,
      values,
    }) => <Form className="project-plan-form" onSubmit={handleSubmit}>
        <GeneralFormError errors={errors} prefix="project" values={values} />

        <Field component={FormikRange}
          help="form.project.planSelfAssessment.help"
          label="project.planSelfAssessment"
          name="planSelfAssessment"
          labels={{
            [SelfAssessment.STARTING]: t("progress.0"),
            [SelfAssessment.MAKING_PROGRESS]: t("progress.25"),
            [SelfAssessment.HALF_FINISHED]: t("progress.50"),
            [SelfAssessment.ALMOST_FINISHED]: t("progress.75"),
            [SelfAssessment.COMPLETE]: t("progress.100"),
          }}
          value={values.planSelfAssessment}
        />
        <div className="button-area">
          {values.planSelfAssessment !== project.planSelfAssessment
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
}

export default SelfAssessmentForm
