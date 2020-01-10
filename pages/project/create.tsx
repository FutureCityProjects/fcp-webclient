import { WithTranslation } from "next-i18next"
import { NextJSContext } from "next-redux-wrapper"
import React, { useState } from "react"
import { connect, ConnectedProps } from "react-redux"
import { Card, CardBody, CardHeader, CardText, Col, Row, Spinner } from "reactstrap"
import { AnyAction, Dispatch } from "redux"

import { IProjectCreation } from "api/schema"
import StatusCode from "components/common/StatusCode"
import ErrorPage from "components/ErrorPage"
import Layout from "components/Layout"
import ProjectCreationForm from "components/project/ProjectCreationForm"
import Link from "next/link"
import { createProjectAction, setNewProjectAction } from "redux/actions/newProject"
import { loadModelAction } from "redux/helper/actions"
import { selectIsAuthenticated } from "redux/reducer/auth"
import { Scope, selectById } from "redux/reducer/data"
import { AppState } from "redux/store"
import { I18nPage, includeDefaultNamespaces, withTranslation } from "services/i18n"

const mapDispatchToProps = (dispatch: Dispatch<AnyAction>) => ({
  createProject: (project: IProjectCreation, actions: any) => dispatch(createProjectAction(project, actions)),
  setNewProject: (project: IProjectCreation) => dispatch(setNewProjectAction(project)),
})

const mapStateToProps = (state: AppState, { inspirationId }) => ({
  creationRequest: state.newProject.creation,
  inspiration: selectById(Scope.PROJECT, inspirationId, state),
  inspirationRequest: state.newProject.inspiration,
  isAuthenticated: selectIsAuthenticated(state),
  project: state.newProject.project, // do not use selectNewIdea(), we want the empty state here,
})

const connector = connect(mapStateToProps, mapDispatchToProps)
type PageProps = ConnectedProps<typeof connector> & WithTranslation & {
  inspirationId: any,
}

const Page: I18nPage<PageProps> = (props) => {
  if (!props.inspirationId || props.inspirationId <= 0) {
    return <StatusCode statusCode={400}>
      <ErrorPage statusCode={400} error={"_error:param.invalidId"} />
    </StatusCode>
  }

  // @todo custom error message "inspiration not found" etc.
  if (!props.inspiration && !props.inspirationRequest.isLoading) {
    return <StatusCode statusCode={404}>
      <ErrorPage statusCode={404} error={props.inspirationRequest.loadingError} />
    </StatusCode>
  }

  const [projectSaved, setProjectSaved] = useState(false)
  const [projectCreated, setProjectCreated] = useState(false)

  const onSubmit = (project: IProjectCreation, actions: any) => {
    project.inspiration = props.inspiration["@id"]

    if (props.isAuthenticated) {
      actions.success = () => {
        setProjectCreated(true)
      }
      props.createProject(project, actions)
      return
    }

    props.setNewProject(project)
    setProjectSaved(true)
  }

  return <Layout>
    <Row>
      <Col>
        <h1>Idee übernehmen</h1>
        <p>
          Hier kannst du aus der gewählten Idee ein neues Projekt erstellen.
        </p>
      </Col>
    </Row>
    <Row>
      <Col sm={8}>
        <Card>
          <CardHeader>Deine Inspiration</CardHeader>
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
          <CardHeader>Angaben zu dir</CardHeader>
          <CardBody>
            {!projectSaved && !projectCreated && <>
              {props.creationRequest.loadingError
                && <p className="text-danger">Error: {props.creationRequest.loadingError}</p>}
              <ProjectCreationForm onSubmit={onSubmit} project={props.project} />
            </>}

            {projectCreated && <>
              <CardText className="text-success">
                Vielen Dank, dein Projekt wurde erstellt!
              </CardText>
            </>}

            {projectSaved && <>
              <CardText className="text-success">
                Vielen Dank, um dein Projekt zu sichern brauchst du ein Benutzerkonto.
              </CardText>
              <CardText className="text-center">
                Du hast bereits ein Benutzerkonto? Nach dem Login wird das Projekt erstellt!
              </CardText>
              <CardText className="text-center">
                <Link href="/login">
                  <a className="btn btn-primary">Jetzt einloggen</a>
                </Link>
              </CardText>
              <CardText className="text-center">
                Noch kein Konto auf der Plattform? Nach der Registrierung wird dein Projekt erstellt
                und bei Freischaltung deines Kontos sichtbar.
              </CardText>
              <CardText className="text-center">
                <Link href="/user/register">
                  <a className="btn btn-primary">Jetzt registrieren</a>
                </Link>
              </CardText>
            </>}
          </CardBody>
        </Card>
      </Col>
    </Row>
  </Layout>
}

Page.getInitialProps = ({ store, query }: NextJSContext) => {
  const inspirationId = parseInt(query.inspiration as string, 10)

  if (inspirationId > 0 && !selectById(Scope.PROJECT, inspirationId, store.getState())) {
    store.dispatch(loadModelAction(Scope.PROJECT, "inspiration_request", { id: inspirationId }))
  }

  const props = mapStateToProps(store.getState(), { inspirationId })
  return { ...props, inspirationId, namespacesRequired: includeDefaultNamespaces() }
}

export default connector(withTranslation("common")(Page))
