import { WithTranslation } from "next-i18next"
import Link from "next/link"
import React, { useState } from "react"
import { connect, ConnectedProps } from "react-redux"
import { Card, CardBody, CardHeader, CardText, Col, Row } from "reactstrap"
import { AnyAction, Dispatch } from "redux"

import { IUser } from "api/schema"
import BaseLayout from "components/BaseLayout"
import Redirect from "components/common/Redirect"
import TranslatedHtml from "components/common/TranslatedHtml"
import RegistrationForm from "components/user/RegistrationForm"
import { registerUserAction } from "redux/actions/registration"
import { AppState } from "redux/reducer"
import { selectIsAuthenticated } from "redux/reducer/auth"
import { I18nPage, includeDefaultNamespaces, withTranslation } from "services/i18n"
import { Routes } from "services/routes"

const mapDispatchToProps = (dispatch: Dispatch<AnyAction>) => ({
  registerUser: (user: IUser, actions: any) => dispatch(registerUserAction(user, actions)),
})

const mapStateToProps = (state: AppState) => ({
  isAuthenticated: selectIsAuthenticated(state),
})

const connector = connect(mapStateToProps, mapDispatchToProps)
type PageProps = ConnectedProps<typeof connector> & WithTranslation

const RegistrationPage: I18nPage<PageProps> = ({ isAuthenticated, registerUser, t }) => {
  const [registered, setRegistered] = useState(false)

  if (isAuthenticated) {
    return <Redirect route={Routes.USER_PROFILE} />
  }

  const onSubmit = (user: IUser, actions: any) => {
    actions.success = () => {
      setRegistered(true)
    }
    registerUser(user, actions)
  }

  return <BaseLayout pageTitle={t("page.user.register.title")}>
    <Row>
      <Col>
        <h1>{t("page.user.register.heading")}</h1>
        <p><TranslatedHtml content="page.user.register.intro" /></p>
      </Col>
    </Row>
    <Row>
      <Col sm={8}>
        <Card>
          <CardHeader>{t("form.registration.header")}</CardHeader>
          <CardBody>
            {!registered && <>
              <RegistrationForm onSubmit={onSubmit} />
            </>}

            {registered && <>
              <CardText className="text-success">
                <TranslatedHtml content="page.user.register.userCreated" />
              </CardText>
              <CardText className="text-center">
                <Link href={Routes.LOGIN}>
                  <a className="btn btn-primary">{t("goto.login")}</a>
                </Link>
              </CardText>
            </>}

          </CardBody>
        </Card>
      </Col>
    </Row>
  </BaseLayout>
}

RegistrationPage.getInitialProps = () => ({
  namespacesRequired: includeDefaultNamespaces(),
})

export default connector(withTranslation(includeDefaultNamespaces())(RegistrationPage))
