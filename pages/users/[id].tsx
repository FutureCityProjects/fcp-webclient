import { WithTranslation } from "next-i18next"
import { NextJSContext } from "next-redux-wrapper"
import React from "react"
import { connect, ConnectedProps } from "react-redux"
import { Spinner } from "reactstrap"

import { ROLES } from "api/schema"
import StatusCode from "components/common/StatusCode"
import ErrorPage from "components/ErrorPage"
import { withAuth } from "components/hoc/withAuth"
import Layout from "components/Layout"
import { Show } from "components/user/Show"
import { loadModelAction } from "redux/helper/actions"
import { Scope, selectById } from "redux/reducer/data"
import { AppState } from "redux/store"
import { I18nPage, includeDefaultNamespaces, withTranslation } from "services/i18n"
import { REQUEST_ERRORS } from "services/requestError"

const mapStateToProps = (state: AppState, { id }) => ({
  request: state.userManagement.request,
  user: selectById(Scope.USER, id, state),
})

const connector = connect(mapStateToProps)
type PageProps = ConnectedProps<typeof connector> & WithTranslation & {
  id: any,
}

const Page: I18nPage<PageProps> = ({ id, request, user }) => {
  if (!id || id <= 0) {
    return <StatusCode statusCode={400}>
      <ErrorPage statusCode={400} error={"_error:param.invalidId"} />
    </StatusCode>
  }

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
    {request.isLoading
      ? <Spinner />
      : <Show user={user} />
    }
  </Layout>
}

Page.getInitialProps = ({ store, query }: NextJSContext) => {
  const id = parseInt(query.id as string, 10)

  if (id > 0 && !selectById(Scope.USER, id, store.getState())) {
    store.dispatch(loadModelAction(Scope.USER, "userManagement", { id }))
  }

  const state = mapStateToProps(store.getState(), { id })
  return { ...state, id, namespacesRequired: includeDefaultNamespaces() }
}

export default withAuth(connector(withTranslation("common")(Page)), ROLES.ROLE_ADMIN)
