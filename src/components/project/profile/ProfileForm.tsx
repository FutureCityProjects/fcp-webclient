import { Field, Form, Formik } from "formik"
import React from "react"
import { Button, Card, CardBody, CardHeader, Col, Row, Spinner } from "reactstrap"

import { IProject, SelfAssessment } from "api/schema"
import DropdownComponent from "components/common/DropdownComponent"
import FormikInput from "components/common/form/FormikInput"
import FormikRange from "components/common/form/FormikRange"
import FormikRTE from "components/common/form/FormikRTE"
import GeneralFormError from "components/common/form/GeneralFormError"
import Icon from "components/common/Icon"
import Link from "next/link"
import { useTranslation } from "services/i18n"
import { Routes, routeWithParams } from "services/routes"

// @todo complete validation
const validate = (values: IProject) => {
  if (values) {
    const errors: { [key: string]: string } = {}

    if (!values.shortDescription) {
      errors.shortDescription = "validate.general.notBlank"
    }

    return errors
  }
}

interface IProps {
  onSubmit: any
  project: IProject
}

const ProfileForm: React.FC<IProps> = (props: IProps) => {
  const { onSubmit, project } = props
  const { t } = useTranslation()

  return <Card className="body-card">
    <Formik
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
      }) => <Form className="profile-form" onSubmit={handleSubmit}>
          <GeneralFormError
            errors={errors}
            prefix="project"
            excludeFields={["challenges", "delimitation", "description", "goal", "name",
              "profileSelfAssessment", "shortDescription", "vision"]}
          />
          <CardHeader>
            <Field component={FormikInput}
              help="form.project.name.help"
              name="name"
              placeholder="form.project.name.placeholder"
              value={values.name}
              type="text"
            />

            <div className="icon-navigation">
              <DropdownComponent className="navigation-item" button={<Icon name="grid" size={24} />}>
                <Link
                  href={Routes.PROJECT_PROFILE}
                  as={routeWithParams(Routes.PROJECT_PROFILE, { slug: project.slug || project.id })}
                >
                  <a>{t("goto.profileOverview")}</a>
                </Link>
                <Link href={Routes.MY_PROJECTS} as={Routes.MY_PROJECTS + "#project-" + project.id}>
                  <a>{t("goto.myProjects")}</a>
                </Link>
              </DropdownComponent>
            </div>
          </CardHeader>

          <CardBody>
            <Row>
              <Col>
                <h2 className="card-title">{t("project.profile")}</h2>
              </Col>
              <Col className="text-right">
                <Button className="btn-action btn-icon" type="submit" color="primary" disabled={isSubmitting}>
                  <Icon name="save" size={18} />
                  {t("form.saveChanges")} {isSubmitting && <Spinner />}
                </Button>
              </Col>
            </Row>
            <Row>
              <Col lg>
                <Field component={FormikInput}
                  help="form.project.shortDescription.help"
                  label="project.shortDescription"
                  name="shortDescription"
                  placeholder="form.project.shortDescription.placeholder"
                  type="textarea"
                  value={values.shortDescription}
                />
                <Field component={FormikRTE}
                  help="form.project.challenges.help"
                  label="project.challenges"
                  name="challenges"
                  placeholder="form.project.challenges.placeholder"
                  value={values.challenges}
                />
                <Field component={FormikRTE}
                  help="form.project.description.help"
                  label="project.description"
                  name="description"
                  placeholder="form.project.description.placeholder"
                  value={values.description}
                />
              </Col>

              <Col lg>
                <Field component={FormikRTE}
                  help="form.project.goal.help"
                  label="project.goal"
                  name="goal"
                  placeholder="form.project.goal.placeholder"
                  value={values.goal}
                />

                <Field component={FormikRTE}
                  help="form.project.vision.help"
                  label="project.vision"
                  name="vision"
                  placeholder="form.project.vision.placeholder"
                  value={values.vision}
                />

                <Field component={FormikRTE}
                  help="form.project.delimitation.help"
                  label="project.delimitation"
                  name="delimitation"
                  placeholder="form.project.delimitation.placeholder"
                  value={values.delimitation}
                />

                <Field component={FormikRange}
                  help="form.project.profileSelfAssessment.help"
                  label="project.profileSelfAssessment"
                  name="profileSelfAssessment"
                  labels={{
                    [SelfAssessment.STARTING]: t("progress.0"),
                    [SelfAssessment.MAKING_PROGRESS]: t("progress.25"),
                    [SelfAssessment.HALF_FINISHED]: t("progress.50"),
                    [SelfAssessment.ALMOST_FINISHED]: t("progress.75"),
                    [SelfAssessment.COMPLETE]: t("progress.100"),
                  }}
                  value={values.profileSelfAssessment}
                />
              </Col>
            </Row>
            <div className="button-area">
              <Button className="btn-action btn-icon" type="submit" color="primary" disabled={isSubmitting}>
                <Icon name="save" size={18} />
                {t("form.saveChanges")} {isSubmitting && <Spinner />}
              </Button>
              <Link
                href={Routes.PROJECT_PROFILE}
                as={routeWithParams(Routes.PROJECT_PROFILE, { slug: project.slug || project.id })}
              >
                <a className="btn btn-light">{t("goto.profileOverview")}</a>
              </Link>
            </div>
          </CardBody>
        </Form>
      }
    </Formik>
  </Card>
}

export default ProfileForm
