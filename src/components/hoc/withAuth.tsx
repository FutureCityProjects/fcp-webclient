import { NextJSContext } from "next-redux-wrapper"
import Router from "next/router"
import React, { Component } from "react"
import { ProviderProps } from "react-redux"

import { ROLES } from "api/schema"
import ErrorPage from "components/ErrorPage"
import { selectHasRole, selectIsAuthenticated } from "redux/reducer/auth"
import { AppState } from "redux/store"

interface IProps extends ProviderProps {
  hasRequiredRole: boolean
}

export function withAuth(WrappedComponent: any, requiredRole: ROLES) {
  return class extends Component<IProps> {
    public static async getInitialProps(ctx: NextJSContext) {

      // the FCPApp fills the state.auth server-side if there
      // is an auth cookie, so we can simply check the state here
      const state: AppState = ctx.store.getState()

      // redirect to the login page when no auth token is present or it expired
      if (!selectIsAuthenticated(state)) {
        // @todo ifExpired(authState) set message to show
        // on the login form: "your session expired, please login again"

        if (ctx.isServer) {
          ctx.res.writeHead(302, {
            Location: "/login?redirectBack=" + ctx.pathname,
          })
          ctx.res.end()
        } else {
          Router.push("/login?redirectBack=" + ctx.pathname)
        }

        // important: prevent calling getInitialProps on the
        // child component, it's unnecessary and will probably
        // fail anyways without a valid auth token
        return { hasRequiredRole: false }
      }

      const authProps = { hasRequiredRole: selectHasRole(state, requiredRole) }

      return WrappedComponent.getInitialProps
        ? { ...authProps, ...await WrappedComponent.getInitialProps(ctx) }
        : authProps
    }

    public render() {
      return this.props.hasRequiredRole
        ? < WrappedComponent {...this.props} />
        : <ErrorPage statusCode={403} />
    }
  }
}
