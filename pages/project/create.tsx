import { WithTranslation } from "next-i18next"
import { NextJSContext } from "next-redux-wrapper"
import React, { useState } from "react"
import { connect, ConnectedProps } from "react-redux"
import { Card, CardBody, CardHeader, CardText, Col, Row } from "reactstrap"
import { AnyAction, Dispatch } from "redux"

import { IProjectCreation } from "api/schema"
import StatusCode from "components/common/StatusCode"
import ErrorPage from "components/ErrorPage"
import Layout from "components/Layout"
import ProjectCreationForm from "components/project/ProjectCreationForm"
import Link from "next/link"
import { createProjectAction, setNewProjectAction } from "redux/actions/newProject"
import { selectIsAuthenticated } from "redux/reducer/auth"
import { AppState } from "redux/store"
import { I18nPage, includeDefaultNamespaces, withTranslation } from "services/i18n"

const mapDispatchToProps = (dispatch: Dispatch<AnyAction>) => ({
  createProject: (project: IProjectCreation, actions: any) => dispatch(createProjectAction(project, actions)),
  setNewProject: (project: IProjectCreation) => dispatch(setNewProjectAction(project)),
})

const mapStateToProps = (state: AppState) => ({
  isAuthenticated: selectIsAuthenticated(state),
  project: state.newProject.project, // do not use selectNewIdea(), we want the empty state here,
  request: state.newProject.request,
})

const connector = connect(mapStateToProps, mapDispatchToProps)
type PageProps = ConnectedProps<typeof connector> & WithTranslation & {
  id: any,
}

const Page: I18nPage<PageProps> = (props) => {
  if (!props.id || props.id <= 0) {
    return <StatusCode statusCode={400}>
      <ErrorPage statusCode={400} error={"_error:param.invalidId"} />
    </StatusCode>
  }

  const [projectSaved, setProjectSaved] = useState(false)
  const [projectCreated, setProjectCreated] = useState(false)

  const onSubmit = (project: IProjectCreation, actions: any) => {
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
          <CardHeader>Angaben zu dir</CardHeader>
          <CardBody>
            {!projectSaved && !projectCreated && <>
              {props.request.loadingError && <p className="text-danger">Error: {props.request.loadingError}</p>}
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

Page.getInitialProps = ({ store }: NextJSContext) => {
  const props = mapStateToProps(store.getState())
  return { ...props, namespacesRequired: includeDefaultNamespaces() }
}

export default connector(withTranslation("common")(Page))
