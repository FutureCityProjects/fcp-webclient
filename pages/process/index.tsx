import { NextPageContext } from "next"
import { WithTranslation } from "next-i18next"
import React from "react"
import { connect, ConnectedProps } from "react-redux"
import { Col, Row, Spinner } from "reactstrap"

import BaseLayout from "components/BaseLayout"
import PageError from "components/common/PageError"
import Redirect from "components/common/Redirect"
import TranslatedHtml from "components/common/TranslatedHtml"
import ProcessView from "components/process/ProcessView"
import { loadCurrentProcessAction } from "redux/actions/currentProcess"
import { AppState } from "redux/reducer"
import { selectRoles } from "redux/reducer/auth"
import { selectCurrentProcess } from "redux/reducer/data"
import { I18nPage, includeDefaultNamespaces, withTranslation } from "services/i18n"
import { Routes } from "services/routes"

const mapStateToProps = (state: AppState) => ({
  process: selectCurrentProcess(state),
  request: state.requests.processLoading,
  roles: selectRoles(state),
})

const connector = connect(mapStateToProps)
type PageProps = ConnectedProps<typeof connector> & WithTranslation

// @todo move to /management/processes for multi-mandant
const ProcessDetailPage: I18nPage<PageProps> = ({ process, request, roles, t }) => {
  if (!request.isLoading && !process) {
    return <Redirect route={Routes.ProcessCreate} />
  }

  return <BaseLayout pageTitle={t("page.process.index.title")}>
    <Row>
      <Col sm={8}>
        <h1>{t("page.process.index.heading")}</h1>
        <p><TranslatedHtml content="page.process.index.intro" /></p>

        {request.isLoading && <Spinner />}
        <PageError error={request.loadingError} />
        {process && <ProcessView process={process} roles={roles} />}
      </Col>
    </Row>
  </BaseLayout>
}

ProcessDetailPage.getInitialProps = ({ store }: NextPageContext) => {
  if (!selectCurrentProcess(store.getState())) {
    store.dispatch(loadCurrentProcessAction())
  }

  return { namespacesRequired: includeDefaultNamespaces() }
}

export default connector(withTranslation(includeDefaultNamespaces())(ProcessDetailPage))
