import { WithTranslation } from "next-i18next"
import { NextJSContext } from "next-redux-wrapper"
import Link from "next/link"
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
import { Routes } from "services/routes"

const mapDispatchToProps = (dispatch: Dispatch<AnyAction>) => ({
  createProject: (project: IProjectCreation, actions: any) =>
    dispatch(createProjectAction(project, actions)),
  setNewProject: (project: IProjectCreation) =>
    dispatch(setNewProjectAction(project)),
})

const mapStateToProps = (state: AppState, { inspirationId }) => ({
  creationRequest: state.requests.projectOperation,
  inspiration: selectById(state, EntityType.PROJECT, inspirationId),
  inspirationRequest: state.requests.projectLoading,
  isAuthenticated: selectIsAuthenticated(state),
  project: state.newProject, // do not use selectNewProject(), we want the empty state here,
})

const connector = connect(mapStateToProps, mapDispatchToProps)
type PageProps = ConnectedProps<typeof connector> & WithTranslation & {
  inspirationId: any,
}

const ProjectCreationPage: I18nPage<PageProps> = (props) => {
  if (!props.inspirationId || props.inspirationId <= 0) {
    return <StatusCode statusCode={400}>
      <ErrorPage statusCode={400} error={"failure.invalidRequest"} />
    </StatusCode>
  }

  // @todo custom error message "inspiration not found" etc.
  if (!props.inspiration && !props.inspirationRequest.isLoading) {
    return <StatusCode statusCode={404}>
      <ErrorPage statusCode={404} error={props.inspirationRequest.loadingError} />
    </StatusCode>
  }

  const { creationRequest, t } = props
  const [projectSaved, setProjectSaved] = useState(false)
  const [projectCreated, setProjectCreated] = useState(false)

  const onSubmit = (project: IProjectCreation, actions: any) => {
    project.inspiration = props.inspiration["@id"]

    if (props.isAuthenticated) {
      // @todo directly redirect to the profile form?
      actions.success = () => {
        setProjectCreated(true)
      }
      props.createProject(project, actions)
      return
    }

    props.setNewProject(project)
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
            {!projectSaved && !projectCreated && <>
              <PageError error={creationRequest.loadingError} />
              <ProjectCreationForm onSubmit={onSubmit} project={props.project} />
            </>}

            {projectCreated && <>
              <CardText className="text-success">
                <TranslatedHtml content="page.projects.create.projectCreated" />
              </CardText>
            </>}

            {projectSaved && <>
              <CardText className="text-success">
                <TranslatedHtml content="page.projects.create.projectNotSaved" />
              </CardText>
              <CardText className="text-center">
                <TranslatedHtml content="page.projects.create.saveViaLogin" />
              </CardText>
              <CardText className="text-center">
                <Link href={Routes.LOGIN}>
                  <a className="btn btn-primary">{t("goto.login")}</a>
                </Link>
              </CardText>
              <CardText className="text-center">
                <TranslatedHtml content="page.projects.create.saveViaRegistration" />
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
  </BaseLayout>
}

ProjectCreationPage.getInitialProps = ({ store, query }: NextJSContext) => {
  const inspirationId = parseInt(query.inspiration as string, 10)
  if (inspirationId > 0 && !selectById(store.getState(), EntityType.PROJECT, inspirationId)) {
    store.dispatch(loadModelAction(EntityType.PROJECT, { id: inspirationId }))
  }

  return { inspirationId, namespacesRequired: includeDefaultNamespaces() }
}

export default connector(withTranslation(includeDefaultNamespaces())(ProjectCreationPage))
