import { WithTranslation } from "next-i18next"
import { NextJSContext } from "next-redux-wrapper"
import Link from "next/link"
import React from "react"
import { connect, ConnectedProps } from "react-redux"
import { Button, Col, Row, Spinner } from "reactstrap"

import { ROLES } from "api/schema"
import Redirect from "components/common/Redirect"
import { withAuth } from "components/hoc/withAuth"
import Layout from "components/Layout"
import ProcessView from "components/process/ProcessView"
import { loadCurrentProcessAction } from "redux/actions/currentProcess"
import { selectCurrentProcess } from "redux/reducer/currentProcess"
import { AppState } from "redux/store"
import { I18nPage, includeDefaultNamespaces, withTranslation } from "services/i18n"

const mapStateToProps = (state: AppState) => ({
  process: selectCurrentProcess(state),
  request: state.currentProcess.request,
})

const connector = connect(mapStateToProps)
type PageProps = ConnectedProps<typeof connector> & WithTranslation

const Page: I18nPage<PageProps> = ({ process, request }) => {
  if (!request.isLoading && !process) {
    return <Redirect route="/process/create" />
  }

  if (request.isLoading) {
    return <Layout title="...loading"><Spinner /></Layout>
  }

  return <Layout>
    <Row>
      <Col>
        {request.loadingError && <p className="text-danger">{request.loadingError}</p>}
        {process && <ProcessView process={process} />}
      </Col>
    </Row>
    <Row>
      <Col>
        <hr />
        <Link href="/process/edit">
          <Button>Prozess bearbeiten</Button>
        </Link>
      </Col>
    </Row>
  </Layout >
}

Page.getInitialProps = async ({ store }: NextJSContext) => {
  if (!selectCurrentProcess(store.getState())) {
    store.dispatch(loadCurrentProcessAction())
  }

  const props = mapStateToProps(store.getState())
  return { ...props, namespacesRequired: includeDefaultNamespaces() }
}

export default withAuth(connector(withTranslation(["common", "_error"])(Page)), ROLES.ROLE_PROCESS_OWNER)
