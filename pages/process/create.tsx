import { WithTranslation } from "next-i18next"
import { NextJSContext } from "next-redux-wrapper"
import Router from "next/router"
import React from "react"
import { connect, ConnectedProps } from "react-redux"
import { Col, Row, Spinner } from "reactstrap"
import { AnyAction, Dispatch } from "redux"

import { UserRole } from "api/schema"
import BaseLayout from "components/BaseLayout"
import Redirect from "components/common/Redirect"
import TranslatedHtml from "components/common/TranslatedHtml"
import { withAuth } from "components/hoc/withAuth"
import ProcessForm from "components/process/ProcessForm"
import { loadCurrentProcessAction } from "redux/actions/currentProcess"
import { createModelAction } from "redux/helper/actions"
import { AppState } from "redux/reducer"
import { selectCurrentProcess } from "redux/reducer/data"
import { EntityType } from "redux/reducer/data"
import { I18nPage, includeDefaultNamespaces, withTranslation } from "services/i18n"
import { Routes } from "services/routes"

const mapDispatchToProps = (dispatch: Dispatch<AnyAction>) => ({
  onSubmit: (process, actions) => {
    actions.success = () => {
      Router.push(Routes.PROCESS_OVERVIEW)
    }
    dispatch(createModelAction(EntityType.PROCESS, process, actions))
  },
})

const mapStateToProps = (state: AppState) => ({
  process: selectCurrentProcess(state),
  request: state.requests.processLoading,
})

const connector = connect(mapStateToProps, mapDispatchToProps)
type PageProps = ConnectedProps<typeof connector> & WithTranslation

// @todo move to /management/processes for multi-mandant
const ProcessCreationPage: I18nPage<PageProps> = ({ onSubmit, process, request, t }) => {
  if (process || request.loadingError) {
    return <Redirect route={Routes.PROCESS_OVERVIEW} />
  }

  return <BaseLayout pageTitle={t("page.process.create.title")}>
    <Row>
      <Col sm={8}>
        <h1>{t("page.process.create.heading")}</h1>
        <p><TranslatedHtml content="page.process.create.intro" /></p>

        {request.isLoading
          ? <Spinner />
          : <ProcessForm onSubmit={onSubmit} />
        }
      </Col>
    </Row>
  </BaseLayout>
}

ProcessCreationPage.getInitialProps = ({ store }: NextJSContext) => {
  if (!selectCurrentProcess(store.getState())) {
    store.dispatch(loadCurrentProcessAction())
  }

  return { namespacesRequired: includeDefaultNamespaces() }
}

export default withAuth(
  connector(
    withTranslation(includeDefaultNamespaces())(ProcessCreationPage),
  ),
  UserRole.PROCESS_OWNER,
)
