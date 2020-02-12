import { Field, Form, Formik } from "formik"
import Link from "next/link"
import React from "react"
import { Button, Card, CardBody, CardHeader, Col, Row, Spinner } from "reactstrap"

import { IProject } from "api/schema"
import DropdownComponent from "components/common/DropdownComponent"
import FormikInput from "components/common/form/FormikInput"
import GeneralFormError from "components/common/form/GeneralFormError"
import Icon from "components/common/Icon"
import { useTranslation } from "services/i18n"
import { Routes, routeWithParams } from "services/routes"

interface IProps {
  onSubmit: any
  project: IProject
}

const ApplicationDataForm = ({ onSubmit, project }: IProps) => {
  const { t } = useTranslation()

  return <Card className="body-card">
    <Formik<IProject>
      initialValues={project}
      onSubmit={onSubmit}
    >
      {({
        errors,
        handleSubmit,
        isSubmitting,
        values,
      }) => <Form onSubmit={handleSubmit}>
          <CardHeader>
            {t("form.project.application.header")}
            <div className="icon-navigation">
              {isSubmitting
                ? <a className="navigation-item" aria-label={t("form.saveChanges")}><Spinner /></a>
                : <a onClick={() => handleSubmit()} className="navigation-item" aria-label={t("form.saveChanges")} title={t("form.saveChanges")}><Icon name="save" size={24} /></a>}
              <DropdownComponent className="navigation-item" button={<Icon name="grid" size={24} />}>
                <Link href={{
                  pathname: Routes.PROJECT_FUND_APPLICATION,
                  // @todo support multiple applications, how to store which one is the active application?
                  query: { fund: project.applications[0].fund.id }
                }} as={{
                  pathname: routeWithParams(Routes.PROJECT_FUND_APPLICATION, { slug: project.slug || project.id }),
                  // @todo support multiple applications, how to store which one is the active application?
                  query: { fund: project.applications[0].fund.id }
                }} >
                  <a>{t("goto.projectApplication")}</a>
                </Link>
                <Link href={Routes.MY_PROJECTS} as={Routes.MY_PROJECTS + "#project-" + project.id}>
                  <a>{t("goto.myProjects")}</a>
                </Link>
              </DropdownComponent>
            </div>
          </CardHeader>
          <CardBody>
            <Row>
              <Col><GeneralFormError errors={errors} prefix="project" values={values} /></Col>
            </Row>
            <Row>
              <Col>
                <Field component={FormikInput}
                  help="form.project.contactName.help"
                  label="project.contactName"
                  maxLength={100}
                  name="contactName"
                  placeholder="form.project.contactName.placeholder"
                  value={values.contactName}
                />

                <Field component={FormikInput}
                  help="form.project.contactPhone.help"
                  label="project.contactPhone"
                  maxLength={100}
                  name="contactPhone"
                  placeholder="form.project.contactPhone.placeholder"
                  value={values.contactPhone}
                />

                <Field component={FormikInput}
                  help="form.project.contactEmail.help"
                  label="project.contactEmail"
                  maxLength={255}
                  name="contactEmail"
                  placeholder="form.project.contactEmail.placeholder"
                  value={values.contactEmail}
                />

                <Field component={FormikInput}
                  help="form.project.holderName.help"
                  label="project.holderName"
                  maxLength={200}
                  name="holderName"
                  placeholder="form.project.holderName.placeholder"
                  value={values.holderName}
                />

                <Field component={FormikInput}
                  help="form.project.holderStreet.help"
                  label="project.holderStreet"
                  maxLength={100}
                  name="holderStreet"
                  placeholder="form.project.holderStreet.placeholder"
                  value={values.holderStreet}
                />

                <Field component={FormikInput}
                  help="form.project.holderAddressInfo.help"
                  label="project.holderAddressInfo"
                  maxLength={100}
                  name="holderAddressInfo"
                  placeholder="form.project.holderAddressInfo.placeholder"
                  value={values.holderAddressInfo}
                />

                <Field component={FormikInput}
                  help="form.project.holderZipCode.help"
                  label="project.holderZipCode"
                  maxLength={10}
                  name="holderZipCode"
                  placeholder="form.project.holderZipCode.placeholder"
                  value={values.holderZipCode}
                />

                <Field component={FormikInput}
                  help="form.project.holderCity.help"
                  label="project.holderCity"
                  maxLength={100}
                  name="holderCity"
                  placeholder="form.project.holderCity.placeholder"
                  value={values.holderCity}
                />
              </Col>
            </Row>
            <div className="button-area">
              <Button className="btn-action btn-icon" type="submit" color="primary" disabled={isSubmitting}>
                <Icon name="save" size={18} />
                {t("form.saveChanges")} {isSubmitting && <Spinner />}
              </Button>
              <Link href={{
                pathname: Routes.PROJECT_FUND_APPLICATION,
                // @todo support multiple applications, how to store which one is the active application?
                query: { fund: project.applications[0].fund.id }
              }} as={{
                pathname: routeWithParams(Routes.PROJECT_FUND_APPLICATION, { slug: project.slug || project.id }),
                // @todo support multiple applications, how to store which one is the active application?
                query: { fund: project.applications[0].fund.id }
              }} >
                <a className="btn btn-light">{t("goto.projectApplication")}</a>
              </Link>
            </div>
          </CardBody>
        </Form>
      }
    </Formik>
  </Card >
}

export default ApplicationDataForm
