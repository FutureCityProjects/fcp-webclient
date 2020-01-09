import { WithTranslation } from "next-i18next"
import { NextJSContext } from "next-redux-wrapper"
import React from "react"
import { connect, ConnectedProps } from "react-redux"
import { Spinner } from "reactstrap"

import { ROLES } from "api/schema"
import { withAuth } from "components/hoc/withAuth"
import Layout from "components/Layout"
import { loadCurrentUserAction } from "redux/actions/currentUser"
import { selectAuthExpiresIn } from "redux/reducer/auth"
import { selectCurrentUser } from "redux/reducer/currentUser"
import { AppState, SagaStore } from "redux/store"
import { I18nPage, includeDefaultNamespaces, withTranslation } from "services/i18n"

const mapStateToProps = (state: AppState) => ({
  currentUser: selectCurrentUser(state),
  expiresIn: selectAuthExpiresIn(state),
  request: state.currentUser.request,
})

const connector = connect(mapStateToProps)
type PageProps = ConnectedProps<typeof connector> & WithTranslation

const Page: I18nPage<PageProps> = ({ expiresIn, currentUser, request }) => {
  return <Layout>
    <h1>Dashboard</h1>
    {request.isLoading
      ? <Spinner />
      : <>
        <p>Hello {currentUser.username}!</p>
        <p>AuthToken expires in {expiresIn} seconds</p>
        <p>Your email: {currentUser.email}</p>
      </>
    }
  </Layout>
}

Page.getInitialProps = (ctx: NextJSContext) => {
  const store: SagaStore = ctx.store

  if (!selectCurrentUser(store.getState())) {
    store.dispatch(loadCurrentUserAction())
  }

  const state = mapStateToProps(store.getState())

  return { ...state, namespacesRequired: includeDefaultNamespaces() }
}

export default withAuth(connector(withTranslation("common")(Page)), ROLES.ROLE_USER)
