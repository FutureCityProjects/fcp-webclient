import { WithTranslation } from "next-i18next"
import { NextJSContext } from "next-redux-wrapper"
import React from "react"
import { connect, ConnectedProps } from "react-redux"
import { Col, Row, Spinner } from "reactstrap"

import { UserRole } from "api/schema"
import BaseLayout from "components/BaseLayout"
import PageError from "components/common/PageError"
import Redirect from "components/common/Redirect"
import TranslatedHtml from "components/common/TranslatedHtml"
import { withAuth } from "components/hoc/withAuth"
import ProcessView from "components/process/ProcessView"
import { loadCurrentProcessAction } from "redux/actions/currentProcess"
import { AppState } from "redux/reducer"
import { selectCurrentProcess } from "redux/reducer/data"
import { I18nPage, includeDefaultNamespaces, withTranslation } from "services/i18n"
import { Routes } from "services/routes"

const mapStateToProps = (state: AppState) => ({
  process: selectCurrentProcess(state),
  request: state.requests.processLoading,
})

const connector = connect(mapStateToProps)
type PageProps = ConnectedProps<typeof connector> & WithTranslation

// @todo move to /management/processes for multi-mandant
const ProcessDetailPage: I18nPage<PageProps> = ({ process, request, t }) => {
  if (!request.isLoading && !process) {
    return <Redirect route={Routes.PROCESS_CREATE} />
  }

  return <BaseLayout pageTitle={t("page.process.index.title")}>
    <Row>
      <Col sm={8}>
        <h1>{t("page.process.index.heading")}</h1>
        <p><TranslatedHtml content="page.process.index.intro" /></p>

        <PageError error={request.loadingError} />
        {request.isLoading && <Spinner />}
        {process && <ProcessView process={process} />}
      </Col>
    </Row>
  </BaseLayout>
}

ProcessDetailPage.getInitialProps = async ({ store }: NextJSContext) => {
  if (!selectCurrentProcess(store.getState())) {
    store.dispatch(loadCurrentProcessAction())
  }

  return { namespacesRequired: includeDefaultNamespaces() }
}

export default withAuth(
  connector(
    withTranslation(includeDefaultNamespaces())(ProcessDetailPage),
  ),
  UserRole.PROCESS_OWNER,
)
