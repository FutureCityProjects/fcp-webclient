import { WithTranslation } from "next-i18next"
import Link from "next/link"
import React, { useState } from "react"
import { connect, ConnectedProps } from "react-redux"
import { Button, Card, CardBody, CardHeader, CardText, Col, Row } from "reactstrap"
import { AnyAction, Dispatch } from "redux"

import { IProject, IProjectCreation } from "api/schema"
import BaseLayout from "components/BaseLayout"
import TranslatedHtml from "components/common/TranslatedHtml"
import IdeaForm from "components/project/IdeaForm"
import { createIdeaAction, setNewIdeaAction } from "redux/actions/newIdea"
import { AppState } from "redux/reducer"
import { selectIsAuthenticated } from "redux/reducer/auth"
import { I18nPage, includeDefaultNamespaces, withTranslation } from "services/i18n"
import { Routes, routeWithParams } from "services/routes"

const mapDispatchToProps = (dispatch: Dispatch<AnyAction>) => ({
  createIdea: (idea: IProjectCreation, actions: any) => dispatch(createIdeaAction(idea, actions)),
  setNewIdea: (idea: IProjectCreation) => dispatch(setNewIdeaAction(idea)),
})

const mapStateToProps = (state: AppState) => ({
  idea: state.newIdea, // do not use selectNewIdea(), we want the emptyIdea here
  isAuthenticated: selectIsAuthenticated(state),
})

const connector = connect(mapStateToProps, mapDispatchToProps)
type PageProps = ConnectedProps<typeof connector> & WithTranslation

const IdeaCreationPage: I18nPage<PageProps> = (props: PageProps) => {
  const { createIdea, idea, isAuthenticated, setNewIdea, t } = props
  const [ideaSaved, setIdeaSaved] = useState(false)
  const [ideaCreated, setIdeaCreated] = useState<IProject>(null)

  const onSubmit = (values: IProjectCreation, actions: any) => {
    if (isAuthenticated) {
      actions.success = (result) => {
        setIdeaCreated(result)
      }
      createIdea(values, actions)
      return
    }

    setNewIdea(values)
    setIdeaSaved(true)
  }

  const resetIdea = () => {
    setIdeaSaved(false)
    setIdeaCreated(null)
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
              <IdeaForm onSubmit={onSubmit} idea={idea} />
            </>}

            {ideaCreated && <>
              <CardText className="text-info">
                <TranslatedHtml content="page.ideas.create.ideaCreated" />
              </CardText>
              <CardText className="quote">
                <blockquote>{ideaCreated.shortDescription}</blockquote>
              </CardText>
              <CardText className="text-center">
                <Link href={routeWithParams(Routes.createProject, { id: ideaCreated.id })}>
                  <a className="btn btn-primary">{t("goto.newProject")}</a>
                </Link>
              </CardText>
              <CardText className="text-center">
                <Button onClick={resetIdea}>{t("page.ideas.create.addOtherIdea")}</Button>
              </CardText>
              <CardText className="text-center">
                <Link href={Routes.marketplace}>
                  <a className="btn btn-secondary">{t("goto.marketplace")}</a>
                </Link>
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
                <Link href={Routes.login}>
                  <a className="btn btn-primary">{t("goto.login")}</a>
                </Link>
              </CardText>
              <CardText className="text-center">
                <TranslatedHtml content="page.ideas.create.saveViaRegistration" />
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

IdeaCreationPage.getInitialProps = () => ({
  namespacesRequired: includeDefaultNamespaces(),
})

export default connector(withTranslation(includeDefaultNamespaces())(IdeaCreationPage))
