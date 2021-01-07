import { Field, FieldArray, Form, Formik } from "formik"
import React from "react"
import { Button, Card, CardBody, CardHeader, Col, Row, Spinner } from "reactstrap"

import { IProject } from "api/schema"
import DropdownComponent from "components/common/DropdownComponent"
import FormikRTE from "components/common/form/FormikRTE"
import GeneralFormError from "components/common/form/GeneralFormError"
import Icon from "components/common/Icon"
import Link from "next/link"
import { useTranslation } from "services/i18n"
import { Routes, routeWithParams } from "services/routes"
import ImpactArray from "./ImpactArray"
import OutcomeArray from "./OutcomeArray"
import ResultsArray from "./ResultsArray"
import TargetGroupsArray from "./TargetGroupsArray"

// @todo complete validation
const validate = (values: IProject) => {
  if (values) {
    const errors: { [key: string]: string } = {}

    if (!values.utilization) {
      errors.utilization = "validate.general.notBlank"
    }

    return errors
  }
}

interface IProps {
  onSubmit: any
  project: IProject
}

const ProjectPlanForm: React.FC<IProps> = (props: IProps) => {
  const { onSubmit, project } = props
  const { t } = useTranslation()

  return <Card className="body-card">
    <Formik<IProject>
      initialValues={project}
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
      }) => <Form className="project-plan-form" onSubmit={handleSubmit}>
          <CardHeader>
            {t("form.project.plan.header")}
            <div className="icon-navigation">
              <DropdownComponent className="navigation-item" button={<Icon name="grid" size={24} />}>
                <Link
                  href={Routes.ProjectPlan}
                  as={routeWithParams(Routes.ProjectPlan, { slug: project.slug || project.id })}
                >
                  <a>{t("goto.planOverview")}</a>
                </Link>
                <Link href={Routes.MyProjects} as={Routes.MyProjects + "#project-" + project.id.toString()}>
                  <a>{t("goto.myProjects")}</a>
                </Link>
              </DropdownComponent>
            </div>
          </CardHeader>
          <CardBody>
            <Row>
              <Col>
                <div className="button-area">
                  <Button className="btn-action btn-icon" type="submit" color="primary" disabled={isSubmitting}>
                    <Icon name="save" size={18} />
                    {t("form.saveChanges")} {isSubmitting && <Spinner />}
                  </Button>
                  <Link
                    href={Routes.ProjectPlan}
                    as={routeWithParams(Routes.ProjectPlan, { slug: project.slug || project.id.toString() }) + "#project-" + project.id.toString()}
                  >
                    <a className="btn btn-light">{t("goto.planOverview")}</a>
                  </Link>
                </div>
                <GeneralFormError
                  errors={errors}
                  prefix="project"
                  excludeFields={["impact", "outcome", "results", "targetGroups", "utilization"]}
                />
                <br />
              </Col>
            </Row>
            <Row>
              <Col lg>
                <FieldArray
                  name="targetGroups"
                  component={TargetGroupsArray}
                />

                <FieldArray
                  name="results"
                  component={ResultsArray}
                />

                <FieldArray
                  name="outcome"
                  component={OutcomeArray}
                />
              </Col>

              <Col lg>
                <FieldArray
                  name="impact"
                  component={ImpactArray}
                />

                <Field component={FormikRTE}
                  help="form.project.utilization.help"
                  label="project.utilization"
                  name="utilization"
                  placeholder="form.project.utilization.placeholder"
                  value={values.utilization}
                />
              </Col>
            </Row>
            <div className="button-area">
              <Button className="btn-action btn-icon" type="submit" color="primary" disabled={isSubmitting}>
                <Icon name="save" size={18} />
                {t("form.saveChanges")} {isSubmitting && <Spinner />}
              </Button>
              <Link
                href={Routes.ProjectPlan}
                as={routeWithParams(Routes.ProjectPlan, { slug: project.slug || project.id.toString() }) + "#project-" + project.id.toString()}
              >
                <a className="btn btn-light">{t("goto.planOverview")}</a>
              </Link>
            </div>
          </CardBody>
        </Form>
      }
    </Formik>
  </Card>
}

export default ProjectPlanForm
