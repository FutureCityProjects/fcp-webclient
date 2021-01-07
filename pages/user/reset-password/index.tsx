import { NextPageContext } from "next"
import { WithTranslation } from "next-i18next"
import React, { useEffect } from "react"
import { connect, ConnectedProps } from "react-redux"
import { Col, Row } from "reactstrap"
import { AnyAction, Dispatch } from "redux"

import BaseLayout from "components/BaseLayout"
import Redirect from "components/common/Redirect"
import ValidationForm from "components/user/ValidationForm"
import { addNotificationAction } from "redux/actions/notifications"
import { confirmAccountAction } from "redux/actions/validation"
import { AppState } from "redux/reducer"
import { I18nPage, includeDefaultNamespaces, withTranslation } from "services/i18n"
import { Routes } from "services/routes"

const mapDispatchToProps = (dispatch: Dispatch<AnyAction>) => ({
  addNotification: (message: string) =>
    dispatch(addNotificationAction(message, "success")),
  confirmValidation: (id: string, token: string, actions: any) =>
    dispatch(confirmAccountAction(id, token, actions)),
})

const mapStateToProps = (state: AppState) => ({
  request: state.requests.validationOperation,
  result: state.validation,
})

interface IValidation {
  id: string
  token: string
}

const connector = connect(mapStateToProps, mapDispatchToProps)
type PageProps = ConnectedProps<typeof connector> & WithTranslation & IValidation

const ResetPasswordPage: I18nPage<PageProps> = (props) => {
  const { addNotification, confirmValidation, id, request, result, token } = props
  if (!result) {
    addNotification("message.account.validated")
    return <Redirect route={Routes.Login} />
  }

  const onSubmit = (values: IValidation, actions: any) => {
    actions.success = () => ({}) // nothing to do, result state is checked automatically
    confirmValidation(values.id, values.token, actions)
  }

  let boundHandler = null
  const bindSetErrors = (handler) => { boundHandler = handler }

  // on mount inject a loadingError from the getInitialProps into the form for display
  useEffect(() => {
    if (request.loadingError) {
      boundHandler({ _error: request.loadingError })
    }
  })

  return <BaseLayout pageTitle="Benutzerkonto bestätigen">
    <Row>
      <Col>
        <h1>Benutzerkonto bestätigen</h1>
        <p>
          Hier kannst du dein Benutzerkonto bestätigen wenn der Link in der Bestätigungs-Email
          nicht automatisch funktioniert.
        </p>
      </Col>
    </Row>
    <Row>
      <Col sm={8}>
        <ValidationForm id={id} token={token} bindErrorHandler={bindSetErrors} onSubmit={onSubmit} />
      </Col>
    </Row>
  </BaseLayout>
}

ResetPasswordPage.getInitialProps = ({ query, store }: NextPageContext) => {
  const token: string = typeof query.token === "string" ? query.token : null
  const id: string = typeof query.id === "string" && /^\d+$/.exec(query.id)
    ? query.id
    : null

  if (token && id) {
    store.dispatch(confirmAccountAction(id, token, null))
  }

  return { id, token, namespacesRequired: includeDefaultNamespaces() }
}

export default connector(withTranslation(includeDefaultNamespaces())(ResetPasswordPage))
