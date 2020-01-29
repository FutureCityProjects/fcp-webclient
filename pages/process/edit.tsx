import { WithTranslation } from "next-i18next"
import { NextJSContext } from "next-redux-wrapper"
import Router from "next/router"
import React, { useState } from "react"
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
import { updateModelAction } from "redux/helper/actions"
import { AppState } from "redux/reducer"
import { selectCurrentProcess } from "redux/reducer/data"
import { EntityType } from "redux/reducer/data"
import { I18nPage, includeDefaultNamespaces, withTranslation } from "services/i18n"
import { Routes } from "services/routes"

const mapDispatchToProps = (dispatch: Dispatch<AnyAction>) => ({
  updateProcess: (process, actions) =>
    dispatch(updateModelAction(EntityType.PROCESS, process, actions))
})

const mapStateToProps = (state: AppState) => ({
  process: selectCurrentProcess(state),
  request: state.requests.processLoading,
})

const connector = connect(mapStateToProps, mapDispatchToProps)
type PageProps = ConnectedProps<typeof connector> & WithTranslation

// @todo move to /management/processes for multi-mandant
const ProcessEditPage: I18nPage<PageProps> = ({ updateProcess, process, request, t }) => {
  const [submitting, setSubmitting] = useState(false)

  const onSubmit = (values, actions) => {
    // add another action additionally to the formik defaults (setErrors, setSubmitting, reset, ...)
    actions.success = () => {
      Router.push(Routes.PROCESS_OVERVIEW)
    }

    // mark page as submitting so the form is not replaced by the spinner
    setSubmitting(true)
    updateProcess(values, actions)
  }

  if (request.loadingError || !process) {
    return <Redirect route={Routes.PROCESS_OVERVIEW} />
  }

  return <BaseLayout pageTitle={t("page.process.edit.heading")}>
    <Row>
      <Col>
        <h1>{t("page.process.edit.heading")}</h1>
        <p><TranslatedHtml content="page.process.edit.intro" /></p>
        {request.isLoading && !submitting
          ? <Spinner />
          : <ProcessForm onSubmit={onSubmit} process={process} />
        }
      </Col>
    </Row>
  </BaseLayout>
}

ProcessEditPage.getInitialProps = async ({ store }: NextJSContext) => {
  if (!selectCurrentProcess(store.getState())) {
    store.dispatch(loadCurrentProcessAction())
  }

  return { namespacesRequired: includeDefaultNamespaces() }
}

export default withAuth(
  connector(
    withTranslation(includeDefaultNamespaces())(ProcessEditPage),
  ),
  UserRole.PROCESS_OWNER,
)
