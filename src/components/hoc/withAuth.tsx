import { NextPageContext } from "next"
import Router from "next/router"
import React, { Component } from "react"
import { ProviderProps } from "react-redux"

import { UserRole } from "api/schema"
import ErrorPage from "components/ErrorPage"
import { addNotificationAction } from "redux/actions/notifications"
import { AppState } from "redux/reducer"
import { selectAuthExpired, selectHasRole, selectIsAuthenticated } from "redux/reducer/auth"
import { includeDefaultNamespaces } from "services/i18n"
import { Routes } from "services/routes"

interface IProps extends ProviderProps {
  hasRequiredRole: boolean
}

export function withAuth(WrappedComponent: any, requiredRole: UserRole) {
  return class WithAuth extends Component<IProps> {
    public static async getInitialProps(ctx: NextPageContext) {
      // the FCPApp fills the state.auth server-side if there
      // is an auth cookie, so we can simply check the state here
      const state: AppState = ctx.store.getState()

      // redirect to the login page when no auth token is present or it expired
      if (!selectIsAuthenticated(state)) {

        // those messages will only be displayed if the page is requested client-side as
        // server-side a simple 302 redirect without state is returned...
        if (selectAuthExpired(state)) {
          ctx.store.dispatch(addNotificationAction("message.auth.loginExpired", "error"))
        } else {
          ctx.store.dispatch(addNotificationAction("message.auth.loginRequired", "warning"))
        }

        if (ctx.isServer) {
          ctx.res.writeHead(302, {
            Location: Routes.Login + "?redirectBack=" + ctx.asPath,
          })
          ctx.res.end()
        } else {
          void Router.push(Routes.Login + "?redirectBack=" + ctx.asPath)
        }

        // important: prevent calling getInitialProps on the
        // child component, it's unnecessary and will probably
        // fail anyways without a valid auth token
        return { hasRequiredRole: false, namespacesRequired: includeDefaultNamespaces() }
      }

      const hasRequiredRole = selectHasRole(state, requiredRole)

      return WrappedComponent.getInitialProps && hasRequiredRole
        ? { hasRequiredRole, ...await WrappedComponent.getInitialProps(ctx) }
        : { hasRequiredRole, namespacesRequired: includeDefaultNamespaces() }
    }

    public render() {
      return this.props.hasRequiredRole
        ? <WrappedComponent {...this.props} />
        : <ErrorPage statusCode={403} />
    }
  }
}
