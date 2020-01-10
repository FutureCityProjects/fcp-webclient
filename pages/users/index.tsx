import { WithTranslation } from "next-i18next"
import { NextJSContext } from "next-redux-wrapper"
import React from "react"
import { connect, ConnectedProps } from "react-redux"
import { Col, Row, Spinner } from "reactstrap"

import { ROLES } from "api/schema"
import StatusCode from "components/common/StatusCode"
import ErrorPage from "components/ErrorPage"
import { withAuth } from "components/hoc/withAuth"
import Layout from "components/Layout"
import { List } from "components/user/List"
import { loadCollectionAction } from "redux/helper/actions"
import { Scope, selectCollection } from "redux/reducer/data"
import { AppState } from "redux/store"
import { I18nPage, includeDefaultNamespaces, withTranslation } from "services/i18n"
import { REQUEST_ERRORS } from "services/requestError"

const mapStateToProps = (state: AppState) => ({
  request: state.userManagement.request,
  users: selectCollection(Scope.USER, state),
})

const connector = connect(mapStateToProps)
type PageProps = ConnectedProps<typeof connector> & WithTranslation

const Page: I18nPage<PageProps> = ({ request, users }: PageProps) => {
  if (!request.isLoading && request.loadingError) {
    let code: number = 500
    let error: string = null
    switch (request.loadingError) {
      case REQUEST_ERRORS.BAD_REQUEST:
        code = 400
        break

      case REQUEST_ERRORS.NOT_FOUND:
        code = 404
        break

      default:
        error = request.loadingError
        break
    }
    return <StatusCode statusCode={code}>
      <ErrorPage statusCode={code} error={error} />
    </StatusCode>
  }

  return <Layout>
    <Row>
      <Col>
        {request.isLoading
          ? <Spinner />
          : <List users={users} />
        }
      </Col>
    </Row>
  </Layout>
}

Page.getInitialProps = async ({ store }: NextJSContext) => {
  if (selectCollection(Scope.USER, store.getState()).length <= 0) {
    store.dispatch(loadCollectionAction(Scope.USER, "userManagement"))
  }

  const props = mapStateToProps(store.getState())
  return { ...props, namespacesRequired: includeDefaultNamespaces() }
}

export default withAuth(connector(withTranslation("common")(Page)), ROLES.ROLE_ADMIN)
