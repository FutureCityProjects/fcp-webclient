import { NextPageContext } from "next"
import { WithTranslation } from "next-i18next"
import Router from "next/router"
import React, { useEffect } from "react"
import { connect, ConnectedProps } from "react-redux"
import { Col, Row } from "reactstrap"
import { AnyAction, Dispatch } from "redux"

import BaseLayout from "components/BaseLayout"
import Redirect from "components/common/Redirect"
import TranslatedHtml from "components/common/TranslatedHtml"
import ValidationForm from "components/user/ValidationForm"
import { confirmAccountAction, resetValidationResultAction } from "redux/actions/validation"
import { AppState } from "redux/reducer"
import { I18nPage, includeDefaultNamespaces, withTranslation } from "services/i18n"
import { Routes } from "services/routes"

const mapDispatchToProps = (dispatch: Dispatch<AnyAction>) => ({
  confirmValidation: (id: string, token: string, actions: any) =>
    dispatch(confirmAccountAction(id, token, actions)),
  resetValidation: () => dispatch(resetValidationResultAction()),
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

const ConfirmAccountPage: I18nPage<PageProps> = (props) => {
  const { confirmValidation, id, request, result, resetValidation, t, token } = props

  // this can either be from the getInitialProps triggered action server-side or after
  // the form submitted successfully in the browser, the notification is already set by the
  // saga. We redirect only on the browser as we would loose all state on server-side redirect:
  // no validation result and/or no notification message
  if (process.browser && result) {
    resetValidation()
    return <Redirect route={Routes.login} />
  }

  const onSubmit = (values: IValidation, actions: any) => {
    actions.success = () => {
      Router.push(Routes.login)
    }
    confirmValidation(values.id, values.token, actions)
  }

  // on mount inject any loadingError from the action triggered via getInitialProps into the
  // form for display so we can re-use the markup and it disappears when the form is validated
  // client-side
  let boundHandler = null
  const bindSetErrors = (handler) => { boundHandler = handler }
  useEffect(() => {
    if (request.loadingError) {
      boundHandler({ _error: request.loadingError })
    }
  })

  return <BaseLayout pageTitle={t("page.user.confirmAccount.title")}>
    <Row>
      <Col>
        <h1>{t("page.user.confirmAccount.heading")}</h1>
        <p><TranslatedHtml content="page.user.confirmAccount.intro" /></p>
      </Col>
    </Row>
    <Row>
      <Col sm={8}>
        <ValidationForm
          id={id}
          token={token}
          bindErrorHandler={bindSetErrors}
          onSubmit={onSubmit}
        />
      </Col>
    </Row>
  </BaseLayout>
}

ConfirmAccountPage.getInitialProps = ({ query, store }: NextPageContext) => {
  const token: string = typeof query.token === "string" ? query.token : null
  const id: string = typeof query.id === "string" && query.id.toString().match(/^\d+$/)
    ? query.id.toString()
    : null

  if (token && id) {
    store.dispatch(confirmAccountAction(id, token, null))
  }

  return { id, token, namespacesRequired: includeDefaultNamespaces() }
}

export default connector(withTranslation(includeDefaultNamespaces())(ConfirmAccountPage))
