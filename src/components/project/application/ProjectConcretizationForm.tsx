import { Field, Form, Formik } from "formik"
import Link from "next/link"
import React, { ReactElement } from "react"
import { Button, Card, CardBody, CardHeader, FormGroup, Spinner } from "reactstrap"

import { IFund, IFundApplication, IProject, SelfAssessment } from "api/schema"
import DropdownComponent from "components/common/DropdownComponent"
import FormikRange from "components/common/form/FormikRange"
import FormikRTE from "components/common/form/FormikRTE"
import GeneralFormError from "components/common/form/GeneralFormError"
import Icon from "components/common/Icon"
import { useTranslation } from "services/i18n"
import { Routes } from "services/routes"

interface IProps {
  application?: IFundApplication
  fund: IFund
  onSubmit: any
  project: IProject
}

const ProjectConcretizationForm = ({ application, fund, onSubmit, project }: IProps): ReactElement => {
  const { t } = useTranslation()

  return <Card>
    <Formik<IFundApplication> initialValues={application} onSubmit={onSubmit}>
      {({
        errors,
        handleSubmit,
        isSubmitting,
        values,
      }) => {
        if (!application.concretizations) {
          application.concretizations = {}
        }

        return <Form onSubmit={handleSubmit}>
          <CardHeader>
            {t("fundApplication.fund") + ": " + fund.name}
            <div className="icon-navigation">
              <DropdownComponent className="navigation-item" button={<Icon name="grid" size={24} />}>
                <Link href={Routes.MyProjects} as={Routes.MyProjects + "#project-" + project.id.toString()}>
                  <a>{t("goto.myProjects")}</a>
                </Link>
              </DropdownComponent>
            </div>
          </CardHeader>
          <CardBody>
            <div className="button-area">
              <FormGroup>
                <Button color="primary" className="btn-action btn-icon" type="submit" disabled={isSubmitting}>
                  <Icon name="save" size={18} />
                  {t("form.saveChanges")} {isSubmitting && <Spinner />}
                </Button>
              </FormGroup>
            </div>
            <GeneralFormError
              errors={errors}
              prefix="fundApplication"
              excludeFields={["concretizations", "concretizationSelfAssessment"]}
            />

            {fund.concretizations.map((concretization) => <Field component={FormikRTE}
              help={concretization.description}
              translateHelp={false}
              label={concretization.question}
              translateLabel={false}
              id={"concretizations-" + concretization.id.toString()}
              key={concretization.id}
              name={"concretizations." + concretization.id.toString()}
              maxLength={concretization.maxLength}
              placeholder={t("form.fundApplication.concretization.placeholder", { maxLength: concretization.maxLength })}
              value={values.concretizations[concretization.id] || ""}
            />)}

            <Field component={FormikRange}
              help="form.fundApplication.concretizationSelfAssessment.help"
              label="fundApplication.concretizationSelfAssessment"
              name="concretizationSelfAssessment"
              labels={{
                [SelfAssessment.Starting]: t("progress.0"),
                [SelfAssessment.MakingProgress]: t("progress.25"),
                [SelfAssessment.HalfFinished]: t("progress.50"),
                [SelfAssessment.AlmostFinished]: t("progress.75"),
                [SelfAssessment.Complete]: t("progress.100"),
              }}
              value={values.concretizationSelfAssessment}
            />

            <div className="button-area">
              <Button color="primary" className="btn-action btn-icon" type="submit" disabled={isSubmitting}>
                <Icon name="save" size={18} />
                {t("form.saveChanges")} {isSubmitting && <Spinner />}
              </Button>
              <Link href={Routes.MyProjects} as={Routes.MyProjects + "#project-" + project.id.toString()}>
                <a className="btn btn-light">{t("goto.myProjects")}</a>
              </Link>
            </div>
          </CardBody>
        </Form>
      }}
    </Formik>
  </Card >
}

export default ProjectConcretizationForm
