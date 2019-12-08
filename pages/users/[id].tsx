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
import { loadUserByIdAction } from "redux/actions/users"
import { selectUserById } from "redux/reducer/singleUser"
import { AppState, SagaStore } from "redux/store"
import { I18nPage, includeDefaultNamespaces, withTranslation } from "services/i18n"
import { REQUEST_ERRORS } from "services/requestError"

const mapStateToProps = (state: AppState) => ({
  user: state.singleUser,
})

const connector = connect(mapStateToProps)
type PageProps = ConnectedProps<typeof connector> & WithTranslation & {
  id: any,
}

const Page: I18nPage<PageProps> = ({ id, user }) => {
  if (!id || id <= 0) {
    return <StatusCode statusCode={400}>
      <ErrorPage statusCode={400} error={"_error:param.invalidId"} />
    </StatusCode>
  }

  if (!user.isLoading && user.loadingError) {
    const code = user.loadingError === REQUEST_ERRORS.NOT_FOUND ? 404 : 500
    return <StatusCode statusCode={code}>
      <ErrorPage statusCode={code} error={user.loadingError !== REQUEST_ERRORS.NOT_FOUND && user.loadingError} />
    </StatusCode>
  }

  return <Layout>
    {user.isLoading
      ? <Spinner />
      : user.model ? <Show user={user.model} /> : <p>no user?</p>
    }
  </Layout>
}

Page.getInitialProps = (ctx: NextJSContext) => {
  const id = parseInt(ctx.query.id as string, 10)
  const store: SagaStore = ctx.store

  if (id > 0 && !selectUserById(id, store.getState())) {
    store.dispatch(loadUserByIdAction(id))
  }

  const state = mapStateToProps(store.getState())
  return { ...state, id, namespacesRequired: includeDefaultNamespaces() }
}

export default withAuth(connector(withTranslation("common")(Page)), ROLES.ROLE_ADMIN)
