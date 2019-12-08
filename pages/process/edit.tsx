import { WithTranslation } from "next-i18next"
import { NextJSContext } from "next-redux-wrapper"
import Router from "next/router"
import React from "react"
import { connect, ConnectedProps } from "react-redux"
import { Col, Row, Spinner } from "reactstrap"
import { AnyAction, Dispatch } from "redux"

import { ROLES } from "api/schema"
import Redirect from "components/common/Redirect"
import { withAuth } from "components/hoc/withAuth"
import Layout from "components/Layout"
import ProcessForm from "components/process/ProcessForm"
import { loadCurrentProcessAction, loadCurrentProcessSuccessAction, updateProcessAction } from "redux/actions/processes"
import { selectCurrentProcess } from "redux/reducer/currentProcess"
import { AppState } from "redux/store"
import { I18nPage, includeDefaultNamespaces, withTranslation } from "services/i18n"

const mapDispatchToProps = (dispatch: Dispatch<AnyAction>) => ({
  onSubmit: (process, actions) => {
    // add another action additionally to the formik defaults (setErrors, setSubmitting, reset, ...)
    actions.success = () => {
      // update the current process and redirect to the display page
      dispatch(loadCurrentProcessSuccessAction(process))
      Router.push("/process")
    }
    dispatch(updateProcessAction({ process, actions }))
  },
})

const mapStateToProps = (state: AppState) => ({
  process: state.currentProcess,
})

const connector = connect(mapStateToProps, mapDispatchToProps)
type PageProps = ConnectedProps<typeof connector> & WithTranslation

const Page: I18nPage<PageProps> = ({ onSubmit, process }) => {
  if (process.loadingError || !process.model) {
    return <Redirect route="/process" />
  }

  return <Layout>
    <Row>
      <Col>
        <h1>Prozess bearbeiten</h1>
        {process.isLoading
          ? <Spinner />
          : <ProcessForm onSubmit={onSubmit} process={process.model} />
        }
      </Col>
    </Row>
  </Layout>
}

Page.getInitialProps = async ({ store }: NextJSContext) => {
  if (!selectCurrentProcess(store.getState())) {
    store.dispatch(loadCurrentProcessAction())
  }

  const props = mapStateToProps(store.getState())
  return { ...props, namespacesRequired: includeDefaultNamespaces() }
}

export default withAuth(connector(withTranslation("common")(Page)), ROLES.ROLE_PROCESS_OWNER)
