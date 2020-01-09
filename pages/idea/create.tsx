import { WithTranslation } from "next-i18next"
import { NextJSContext } from "next-redux-wrapper"
import React, { useState } from "react"
import { connect, ConnectedProps } from "react-redux"
import { Button, Card, CardBody, CardHeader, CardText, Col, Row } from "reactstrap"
import { AnyAction, Dispatch } from "redux"

import { IProject } from "api/schema"
import Layout from "components/Layout"
import IdeaForm from "components/project/IdeaForm"
import Link from "next/link"
import { createIdeaAction, setNewIdeaAction } from "redux/actions/newIdea"
import { selectIsAuthenticated } from "redux/reducer/auth"
import { AppState } from "redux/store"
import { I18nPage, includeDefaultNamespaces, withTranslation } from "services/i18n"

const mapDispatchToProps = (dispatch: Dispatch<AnyAction>) => ({
  createIdea: (idea: IProject, actions: any) => dispatch(createIdeaAction(idea, actions)),
  setNewIdea: (idea: IProject) => dispatch(setNewIdeaAction(idea)),
})

const mapStateToProps = (state: AppState) => ({
  idea: state.newIdea.idea.data,
  isAuthenticated: selectIsAuthenticated(state),
  request: state.newIdea.request,
})

const connector = connect(mapStateToProps, mapDispatchToProps)
type PageProps = ConnectedProps<typeof connector> & WithTranslation

const Page: I18nPage<PageProps> = (props) => {
  const [ideaSaved, setIdeaSaved] = useState(false)
  const [ideaCreated, setIdeaCreated] = useState(false)

  const onSubmit = (idea: IProject, actions: any) => {
    if (props.isAuthenticated) {
      actions.success = () => {
        setIdeaCreated(true)
      }
      props.createIdea(idea, actions)
      return
    }

    props.setNewIdea(idea)
    setIdeaSaved(true)
  }

  const resetIdea = () => {
    setIdeaSaved(false)
    setIdeaCreated(false)
  }

  return <Layout>
    <Row>
      <Col>
        <h1>Neue Projektidee</h1>
        <p>
          Hier kannst du eine neue Projektidee eintragen. Du selbst oder jemand anderes kann
          sie dann zu einem Projekt weiterentwickeln.
        </p>
      </Col>
    </Row>
    <Row>
      <Col sm={8}>
        <Card>
          <CardHeader>Idee eingeben</CardHeader>
          <CardBody>
            {!ideaSaved && !ideaCreated && <>
              {props.request.loadingError && <p className="text-danger">Error: {props.request.loadingError}</p>}
              <IdeaForm onSubmit={onSubmit} idea={props.idea} />
            </>}

            {ideaCreated && <>
              <CardText className="text-success">
                Vielen Dank, deine Idee wurde gespeichert!
              </CardText>
              <CardText className="text-center">
                <Button onClick={resetIdea}>Weitere Idee eintragen</Button>
              </CardText>
            </>}

            {ideaSaved && <>
              <CardText className="text-success">
                Vielen Dank, um deine Idee zu sichern brauchst du ein Benutzerkonto.
              </CardText>
              <CardText className="text-center">
                Du hast bereits ein Benutzerkonto? Nach dem Login wird die Idee abgepeichert!
              </CardText>
              <CardText className="text-center">
                <Link href="/login">
                  <a className="btn btn-primary">Jetzt einloggen</a>
                </Link>
              </CardText>
              <CardText className="text-center">
                Noch kein Konto auf der Plattform? Nach der Registrierung wird deine Idee gespeichert
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
