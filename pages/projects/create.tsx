import { NextPageContext } from "next"
import { WithTranslation } from "next-i18next"
import Link from "next/link"
import Router from "next/router"
import React, { useState } from "react"
import { connect, ConnectedProps } from "react-redux"
import { Card, CardBody, CardHeader, CardText, Col, Row, Spinner } from "reactstrap"
import { AnyAction, Dispatch } from "redux"

import { IProjectCreation } from "api/schema"
import BaseLayout from "components/BaseLayout"
import PageError from "components/common/PageError"
import StatusCode from "components/common/StatusCode"
import TranslatedHtml from "components/common/TranslatedHtml"
import ErrorPage from "components/ErrorPage"
import ProjectCreationForm from "components/project/ProjectCreationForm"
import { createProjectAction, setNewProjectAction } from "redux/actions/newProject"
import { loadModelAction } from "redux/helper/actions"
import { AppState } from "redux/reducer"
import { selectIsAuthenticated } from "redux/reducer/auth"
import { EntityType, selectById } from "redux/reducer/data"
import { I18nPage, includeDefaultNamespaces, withTranslation } from "services/i18n"
import { Routes, routeWithParams } from "services/routes"

const mapDispatchToProps = (dispatch: Dispatch<AnyAction>) => ({
  createProject: (project: IProjectCreation, actions: any) =>
    dispatch(createProjectAction(project, actions)),
  setNewProject: (project: IProjectCreation) =>
    dispatch(setNewProjectAction(project)),
})

const mapStateToProps = (state: AppState, { inspirationId }) => ({
  inspiration: selectById(state, EntityType.PROJECT, inspirationId),
  inspirationRequest: state.requests.projectLoading,
  isAuthenticated: selectIsAuthenticated(state),
  project: state.newProject, // do not use selectNewProject(), we want the empty state here,
})

const connector = connect(mapStateToProps, mapDispatchToProps)
type PageProps = ConnectedProps<typeof connector> & WithTranslation & {
  inspirationId: any
}

const ProjectCreationPage: I18nPage<PageProps> = (props: PageProps) => {
  const { createProject, inspiration, inspirationId, inspirationRequest, isAuthenticated,
    project, setNewProject, t } = props
  const [projectSaved, setProjectSaved] = useState(false)

  if (!inspirationId || inspirationId <= 0) {
    return <StatusCode statusCode={400}>
      <ErrorPage statusCode={400} error={"failure.invalidRequest"} />
    </StatusCode>
  }

  // @todo custom error message "inspiration not found" etc.
  if (!inspiration && !inspirationRequest.isLoading) {
    return <StatusCode statusCode={404}>
      <ErrorPage statusCode={404} error={inspirationRequest.loadingError} />
    </StatusCode>
  }

  const onSubmit = (values: IProjectCreation, actions: any) => {
    values.inspiration = inspiration["@id"]

    if (isAuthenticated) {
      actions.success = (res) => {
        Router.push(Routes.projectProfileEdit,
          routeWithParams(Routes.projectProfileEdit, { slug: res.id })
        )
      }
      createProject(values, actions)
      return
    }

    setNewProject(values)
    setProjectSaved(true)
  }

  return <BaseLayout pageTitle={t("page.projects.create.title")}>
    <Row>
      <Col>
        <h1>{t("page.projects.create.heading")}</h1>
        <p><TranslatedHtml content="page.projects.create.intro" /></p>
      </Col>
    </Row>
    <Row>
      <Col sm={8}>
        <Card>
          <CardHeader>{t("page.projects.create.inspiration")}</CardHeader>
          <CardBody>
            {props.inspirationRequest.isLoading ? <Spinner />
              : <CardText>
                <PageError error={inspirationRequest.loadingError} />

                {props.inspiration.shortDescription}
              </CardText>
            }
          </CardBody>
        </Card>
      </Col>
    </Row>

    <Row>
      <Col sm={8}>
        <Card>
          <CardHeader>{t("form.project.create.header")}</CardHeader>
          <CardBody>
            {!projectSaved && <>
              <ProjectCreationForm onSubmit={onSubmit} project={project} />
            </>}

            {projectSaved && <>
              <CardText className="text-success">
                <TranslatedHtml content="page.projects.create.projectNotSaved" />
              </CardText>
              <CardText className="text-center">
                <TranslatedHtml content="page.projects.create.saveViaLogin" />
              </CardText>
              <CardText className="text-center">
                <Link href={Routes.login}>
                  <a className="btn btn-primary">{t("goto.login")}</a>
                </Link>
              </CardText>
              <CardText className="text-center">
                <TranslatedHtml content="page.projects.create.saveViaRegistration" />
              </CardText>
              <CardText className="text-center">
                <Link href={Routes.registration}>
                  <a className="btn btn-primary">{t("goto.registration")}</a>
                </Link>
              </CardText>
            </>}
          </CardBody>
        </Card>
      </Col>
    </Row>
  </BaseLayout>
}

ProjectCreationPage.getInitialProps = ({ store, query }: NextPageContext) => {
  const inspirationId = parseInt(query.inspiration as string, 10)
  if (inspirationId > 0 && !selectById(store.getState(), EntityType.PROJECT, inspirationId)) {
    store.dispatch(loadModelAction(EntityType.PROJECT, { id: inspirationId }))
  }

  return { inspirationId, namespacesRequired: includeDefaultNamespaces() }
}

export default connector(withTranslation(includeDefaultNamespaces())(ProjectCreationPage))
