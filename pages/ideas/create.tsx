import { WithTranslation } from "next-i18next"
import Link from "next/link"
import React, { useState } from "react"
import { connect, ConnectedProps } from "react-redux"
import { Button, Card, CardBody, CardHeader, CardText, Col, Row } from "reactstrap"
import { AnyAction, Dispatch } from "redux"

import { IProject } from "api/schema"
import BaseLayout from "components/BaseLayout"
import PageError from "components/common/PageError"
import TranslatedHtml from "components/common/TranslatedHtml"
import IdeaForm from "components/project/IdeaForm"
import { createIdeaAction, setNewIdeaAction } from "redux/actions/newIdea"
import { AppState } from "redux/reducer"
import { selectIsAuthenticated } from "redux/reducer/auth"
import { I18nPage, includeDefaultNamespaces, withTranslation } from "services/i18n"
import { Routes } from "services/routes"

const mapDispatchToProps = (dispatch: Dispatch<AnyAction>) => ({
  createIdea: (idea: IProject, actions: any) => dispatch(createIdeaAction(idea, actions)),
  setNewIdea: (idea: IProject) => dispatch(setNewIdeaAction(idea)),
})

const mapStateToProps = (state: AppState) => ({
  idea: state.newIdea, // do not use selectNewIdea(), we want the emptyIdea here
  isAuthenticated: selectIsAuthenticated(state),
  request: state.requests.projectOperation,
})

const connector = connect(mapStateToProps, mapDispatchToProps)
type PageProps = ConnectedProps<typeof connector> & WithTranslation

const IdeaCreationPage: I18nPage<PageProps> = (props) => {
  const { request, t } = props
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

  return <BaseLayout pageTitle={t("page.ideas.create.title")}>
    <Row>
      <Col>
        <h1>{t("page.ideas.create.heading")}</h1>
        <p><TranslatedHtml content="page.ideas.create.intro" /></p>
      </Col>
    </Row>
    <Row>
      <Col sm={8}>
        <Card>
          <CardHeader>{t("form.idea.header")}</CardHeader>
          <CardBody>
            {!ideaSaved && !ideaCreated && <>
              <PageError error={request.loadingError} />
              <IdeaForm onSubmit={onSubmit} idea={props.idea} />
            </>}

            {ideaCreated && <>
              <CardText className="text-success">
                <TranslatedHtml content="page.ideas.create.ideaCreated" />
              </CardText>
              <CardText className="text-center">
                <Button onClick={resetIdea}>{t("page.ideas.create.addOtherIdea")}</Button>
              </CardText>
            </>}

            {ideaSaved && <>
              <CardText className="text-success">
                <TranslatedHtml content="page.ideas.create.ideaNotSaved" />
              </CardText>
              <CardText className="text-center">
                <TranslatedHtml content="page.ideas.create.saveViaLogin" />
              </CardText>
              <CardText className="text-center">
                <Link href={Routes.LOGIN}>
                  <a className="btn btn-primary">{t("goto.login")}</a>
                </Link>
              </CardText>
              <CardText className="text-center">
                <TranslatedHtml content="page.ideas.create.saveViaRegistration" />
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

IdeaCreationPage.getInitialProps = () => ({
  namespacesRequired: includeDefaultNamespaces(),
})

export default connector(withTranslation(includeDefaultNamespaces())(IdeaCreationPage))
