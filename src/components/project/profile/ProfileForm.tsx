import { Field, Form, Formik } from "formik"
import React from "react"
import { Button, Card, CardBody, CardHeader } from "reactstrap"

import { IProject } from "api/schema"
import FormikInput from "components/common/form/FormikInput"
import FormikRange from "components/common/form/FormikRange"
import FormikRTE from "components/common/form/FormikRTE"
import GeneralFormError from "components/common/form/GeneralFormError"
import Icon from "components/Icon"
import Link from "next/link"
import { useTranslation } from "services/i18n"
import { Routes, routeWithParams } from "services/routes"

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
        values,
        errors,
        handleSubmit,
      }) => {
        return <Form className="profile-form" onSubmit={handleSubmit}>
          <GeneralFormError errors={errors} values={values} />

          <CardHeader>
            <Field component={FormikInput}
              help="Gib deinem Projekt einen Titel"
              name="name"
              placeholder="Projekttitel"
              value={values.name}
              type="text"
            />

            <div className={"save-profile"} onClick={() => handleSubmit()}>
              <Icon name="save" size={42} />
              <Icon name="grid" size={42} />
            </div>
          </CardHeader>

          <h2 className="card-title">{t("project.profile")}</h2>
          <CardBody className="card-body-2-columns">
            <div className="column">
              <Field component={FormikInput}
                help="form.project.shortDescription.help"
                label="project.shortDescription"
                name="shortDescription"
                placeholder="form.project.shortDescription.placeHolder"
                type="textarea"
                value={values.shortDescription}
              />
              <Field component={FormikRTE}
                help="form.project.challenges.help"
                label="project.challenges"
                name="challenges"
                placeholder="form.project.challenges.placeHolder"
                value={values.challenges}
              />
              <Field component={FormikRTE}
                help="form.project.description.help"
                label="project.description"
                name="description"
                placeholder="form.project.description.placeHolder"
                value={values.description}
              />
            </div>

            <div className="column">
              <Field component={FormikRTE}
                help="form.project.goal.help"
                label="project.goal"
                name="goal"
                placeholder="form.project.goal.placeHolder"
                value={values.goal}
              />
              <Field component={FormikRTE}
                help="form.project.vision.help"
                label="project.vision"
                name="vision"
                placeholder="form.project.vision.placeHolder"
                value={values.vision}
              />
              <Field component={FormikRTE}
                help="form.project.delimitation.help"
                label="project.delimitation"
                name="delimitation"
                placeholder="form.project.delimitation.placeHolder"
                value={values.delimitation}
              />
              <Field component={FormikRange}
                help="form.project.profileSelfAssessment.help"
                label="project.profileSelfAssessment"
                name="profileSelfAssessment"
                labels={{
                  0: t("progress.0"),
                  25: t("progress.25"),
                  50: t("progress.50"),
                  75: t("progress.75"),
                  100: t("progress.100"),
                }}
                value={values.profileSelfAssessment}
              />

              <br />
              <p>
                <Button type="submit" color="primary">
                  <Icon name="save" size={42} />&nbsp;
                    {t("form.save")}
                </Button>
                &nbsp;
                  <Link href={Routes.PROJECT_PROFILE}
                  as={routeWithParams(Routes.PROJECT_PROFILE, { slug: project.slug || project.id })}
                >
                  <a className="btn btn-secondary"><Icon name="save" size={42} />&nbsp; Zurück zum Profil</a>
                </Link>
              </p>

            </div>
          </CardBody>
        </Form>
      }}
    </Formik>
  </Card>
}

export default ProfileForm
