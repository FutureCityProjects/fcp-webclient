import { WithTranslation } from "next-i18next"
import { NextJSContext } from "next-redux-wrapper"
import Link from "next/link"
import React, { useState } from "react"
import { connect, ConnectedProps } from "react-redux"
import { Card, CardBody, CardHeader, CardText, Col, Row } from "reactstrap"
import { AnyAction, Dispatch } from "redux"

import { IUser } from "api/schema"
import Redirect from "components/common/Redirect"
import Layout from "components/Layout"
import RegistrationForm from "components/user/RegistrationForm"
import { registerUserAction } from "redux/actions/registration"
import { selectIsAuthenticated } from "redux/reducer/auth"
import { AppState } from "redux/store"
import { I18nPage, includeDefaultNamespaces, withTranslation } from "services/i18n"

const mapDispatchToProps = (dispatch: Dispatch<AnyAction>) => ({
  registerUser: (user: IUser, actions: any) => dispatch(registerUserAction(user, actions)),
})

const mapStateToProps = (state: AppState) => ({
  isAuthenticated: selectIsAuthenticated(state),
  request: state.registration.request,
  user: state.registration.user,
})

const connector = connect(mapStateToProps, mapDispatchToProps)
type PageProps = ConnectedProps<typeof connector> & WithTranslation

const Page: I18nPage<PageProps> = (props) => {
  const [registered, setRegistered] = useState(false)

  if (props.isAuthenticated) {
    return <Redirect route="/" />
  }

  const onSubmit = (user: IUser, actions: any) => {
    actions.success = () => {
      setRegistered(true)
    }
    props.registerUser(user, actions)
  }

  return <Layout>
    <Row>
      <Col>
        <h1>Neues Benutzerkonto</h1>
        <p>
          Hier kannst du ein neues Benutzerkonto für diese Plattform anlegen um Projekte zu
          erstellen oder daran mitzuarbeiten.
        </p>
      </Col>
    </Row>
    <Row>
      <Col sm={8}>
        <Card>
          <CardHeader>Benutzerdaten</CardHeader>
          <CardBody>
            {!registered && <>
              {props.request.loadingError && <p className="text-danger">Error: {props.request.loadingError}</p>}
              <RegistrationForm onSubmit={onSubmit} />
            </>}

            {registered && <>
              <CardText className="text-success">
                Vielen Dank, dein Benutzerkonto wurde angelegt!<br />
                Um dich einloggen zu können klicke bitte auf den Link in der Bestätigungs-Email
                die wir an deine Adresse geschickt haben.<br />
                <small>
                  Dieser Link ist zwei Tage lang gültig, danach wird das inaktive Konto
                  entfernt. Der Email-Versand kann einige Minuten dauern, bitte prüfe auch den Spam-Ordner!
                </small>
              </CardText>
              <CardText className="text-center">
                <Link href="/login">
                  <a className="btn btn-primary">Zum Login</a>
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
