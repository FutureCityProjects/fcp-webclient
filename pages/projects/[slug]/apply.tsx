import { WithTranslation } from "next-i18next"
import { NextJSContext } from "next-redux-wrapper"
import Link from "next/link"
import React, { useState } from "react"
import { connect, ConnectedProps } from "react-redux"
import { Card, CardBody, CardHeader, CardText, Col, Row, Spinner } from "reactstrap"
import { AnyAction, Dispatch } from "redux"

import { IProjectMembership, ProjectProgress, ProjectState } from "api/schema"
import BaseLayout from "components/BaseLayout"
import StatusCode from "components/common/StatusCode"
import TranslatedHtml from "components/common/TranslatedHtml"
import ErrorPage from "components/ErrorPage"
import MemberApplicationForm from "components/project/MemberApplicationForm"
import { createMemberApplicationAction, setNewMemberApplicationAction } from "redux/actions/memberApplication"
import { loadModelAction } from "redux/helper/actions"
import { AppState } from "redux/reducer"
import { selectIsAuthenticated } from "redux/reducer/auth"
import { EntityType, selectById, selectProjectBySlug } from "redux/reducer/data"
import { I18nPage, includeDefaultNamespaces, withTranslation } from "services/i18n"
import { Routes } from "services/routes"

const mapDispatchToProps = (dispatch: Dispatch<AnyAction>) => ({
  createMemberApplication: (application: IProjectMembership, actions: any) =>
    dispatch(createMemberApplicationAction(application, actions)),
  setNewMemberApplication: (application: IProjectMembership) =>
    dispatch(setNewMemberApplicationAction(application)),
})

const mapStateToProps = (state: AppState, { id, slug }) => ({
  isAuthenticated: selectIsAuthenticated(state),
  project: id
    ? selectById(state, EntityType.PROJECT, id)
    : selectProjectBySlug(state, slug),
  request: state.requests.projectLoading,
  application: state.memberApplication, // do not use selectNewMemberApplication(), we want the empty state here,
})

const connector = connect(mapStateToProps, mapDispatchToProps)
type PageProps = ConnectedProps<typeof connector> & WithTranslation & {
  id: number,
  slug: string,
}

const ProjectApplicationPage: I18nPage<PageProps> = (props: PageProps) => {
  const { application, createMemberApplication, isAuthenticated, project, request,
    setNewMemberApplication, t } = props
  const [applicationSaved, setApplicationSaved] = useState(false)
  const [applicationCreated, setApplicationCreated] = useState(false)

  // @todo custom error message "project not found" etc.
  if (!project && !request.isLoading || project.state === ProjectState.DEACTIVATED || project.progress === ProjectProgress.IDEA) {
    return <StatusCode statusCode={404}>
      <ErrorPage statusCode={404} error={request.loadingError} />
    </StatusCode>
  }

  const onSubmit = (values: IProjectMembership, actions: any) => {
    values.project = project["@id"]

    if (isAuthenticated) {
      // @todo directly redirect to the profile form?
      actions.success = () => {
        setApplicationCreated(true)
      }
      createMemberApplication(values, actions)
      return
    }

    setNewMemberApplication(values)
    setApplicationSaved(true)
  }

  return <BaseLayout pageTitle={t("page.projects.apply.title")}>
    <Row>
      <Col>
        <h1>{t("page.projects.apply.heading")}</h1>
        <p><TranslatedHtml content="page.projects.apply.intro" /></p>
      </Col>
    </Row>
    {request.isLoading ? <Spinner /> :
      <Row>
        <Col sm={8}>
          <Card>
            <CardHeader>{project.name ? project.name : t("project.unnamed")}</CardHeader>
            <CardBody>
              <CardText>
                {project.shortDescription}
              </CardText>
            </CardBody>
          </Card>
        </Col>
      </Row>
    }

    <Row>
      <Col sm={8}>
        <Card>
          <CardHeader>{t("form.project.apply.header")}</CardHeader>
          <CardBody>
            {!applicationSaved && !applicationCreated && <>
              <MemberApplicationForm onSubmit={onSubmit} application={application} />
            </>}

            {applicationCreated && <>
              <CardText className="text-success">
                <TranslatedHtml content="page.projects.apply.applicationCreated" />
              </CardText>
            </>}

            {applicationSaved && <>
              <CardText className="text-success">
                <TranslatedHtml content="page.projects.apply.applicationNotSaved" />
              </CardText>
              <CardText className="text-center">
                <TranslatedHtml content="page.projects.apply.saveViaLogin" />
              </CardText>
              <CardText className="text-center">
                <Link href={Routes.LOGIN}>
                  <a className="btn btn-primary">{t("goto.login")}</a>
                </Link>
              </CardText>
              <CardText className="text-center">
                <TranslatedHtml content="page.projects.apply.saveViaRegistration" />
              </CardText>
              <CardText className="text-center">
                <Link href={Routes.REGISTRATION}>
                  <a className="btn btn-primary">{t("goto.registration")}</a>
                </Link>
              </CardText>
            </>}
          </CardBody>
        </Card>
      </Col>
    </Row>
  </BaseLayout >
}

ProjectApplicationPage.getInitialProps = ({ store, query }: NextJSContext) => {
  const slug: string = typeof query.slug === "string" ? query.slug : null
  let id: number = null

  if (slug.match(/^\d+$/)) {
    id = parseInt(slug, 10)

    if (!selectById(store.getState(), EntityType.PROJECT, id)) {
      store.dispatch(loadModelAction(EntityType.PROJECT, { id }))
    }
  } else if (slug && !selectProjectBySlug(store.getState(), slug)) {
    store.dispatch(loadModelAction(EntityType.PROJECT, { slug }))
  }

  return { id, slug, namespacesRequired: includeDefaultNamespaces() }
}

export default connector(withTranslation(includeDefaultNamespaces())(ProjectApplicationPage))
