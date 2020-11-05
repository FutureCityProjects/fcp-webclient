import ServerCookie from "next-cookies"
import withReduxSaga from "next-redux-saga"
import withRedux, { ReduxWrapperAppProps as ReduxProps } from "next-redux-wrapper"
import { AppContext } from "next/app"
import App, { AppProps } from "next/app"
import { Router } from "next/router"
import NextNprogress from "nextjs-progressbar"
import React from "react"
import IdleTimer, { EVENTS } from "react-idle-timer"
import { connect, Provider } from "react-redux"
import { AnyAction, Dispatch } from "redux"

import ToastContainer from "components/common/ToastContainer"
import withServerResponse from "components/hoc/withServerResponse"
import { localStorageChangedAction, setAuthAction, userIsIdleAction } from "redux/actions/auth"
import { makeStore } from "redux/store"
import { AuthToken } from "services/authToken"
import { appWithTranslation } from "services/i18n"
import { AUTH_COOKIE_NAME, AUTH_IDLE_TIMEOUT, AUTH_LOCALSTORAGE_NAME } from "../config"

// single point to import (S)CSS for native Next.js support, all other styles (e.g. from
// node-module) must be loaded there
import "../styles/index.scss"

type Props = AppProps & ReduxProps & {
  authStorageChanged: any,
  isIdle: any,
}

// extend the default App with properties including the Redux store,
// wich is passed down to all React components by the Provider
class FCPApp extends App<Props> {

  // called once server-side
  // called client-side also on page changes
  public static async getInitialProps({ Component, ctx }: AppContext) {
    let pageProps = {}

    if (ctx.isServer) {
      // @todo server-initialize action that handles the server cookie -> store action
      // to keep all auth stuff in the related saga file?

      // this will only be called once, even when makestore() is
      // called multiple times, so no need to check if the store
      // already contains a token -> there is none in the initial state

      const token = ServerCookie(ctx)[AUTH_COOKIE_NAME]
      if (token) {
        // Save auth in the store for use while rendering and transport to the client.
        // We do this here and not in the withAuth-HOC to have the auth data available on every
        // page, e.g. to show login status in the menu, not only on restricted pages.
        // This is also/ required for restricted pages to work client-side without having to
        // read the cookie again
        const auth = new AuthToken(token)
        if (!auth.isExpired) {
          ctx.store.dispatch(setAuthAction(auth.jwt))
        }
      }
    }

    if (Component.getInitialProps) {
      pageProps = await Component.getInitialProps(ctx)
    }

    return { pageProps }
  }

  constructor(props: Props) {
    super(props)
    this.syncLocalAuth = this.syncLocalAuth.bind(this)
  }

  /**
   * When the element holding the auth token changed trigger an action.
   *
   * @param event local storage changed
   */
  public syncLocalAuth(event: { key: string }) {
    if (event.key === AUTH_LOCALSTORAGE_NAME) {
      this.props.authStorageChanged()
    }
  }

  // called once client-side, not again for client page changes
  // also called server-side
  public componentDidMount() {
    if (process.browser) {
      window.addEventListener("storage", this.syncLocalAuth)
      // @todo client-initialize action that triggers refreshTokenAction()
      // and adds the eventlistener for the localstorage itself?

      // @todo in contrast to the behavior of setting window.location and <Link> using
      // Router.push() does not reset the scroll position
      // @see https://github.com/zeit/next.js/issues/3249
      Router.events.on('routeChangeComplete', () => { window.scrollTo(0, 0) })
    }
  }

  // @todo is this ever called?
  public componentWillUnmount() {
    window.removeEventListener("storage", this.syncLocalAuth)
  }

  public render() {
    const { Component, pageProps, store } = this.props

    // the IdleTimer keeps track of user actions (client-side) and triggers a logout after the
    // configured number of seconds.
    // Default events include mouseMove, touchstart, MSPointerMove - we don't count this as "activity"
    const activeEvents: EVENTS[] = ["click", "dblclick", "dragstart", "keydown", "wheel", "mousewheel", "mousedown", "touchmove"]

    // NextNprogress gives a visual indication of route changes while pages are loading
    // ToastContainer wraps react-toastify to show small alert popups

    return (
      <Provider store={store}>
        {process.browser
          ? <IdleTimer
            events={activeEvents}
            onIdle={this.props.isIdle}
            timeout={AUTH_IDLE_TIMEOUT * 10000} // @todo reset to sensible value
          />
          : <></>
        }
        <NextNprogress />
        <ToastContainer />
        <Component {...pageProps} />
      </Provider>
    )
  }
}

const mapDispatchToProps = (dispatch: Dispatch<AnyAction>) => ({
  authStorageChanged: () => dispatch(localStorageChangedAction()),
  isIdle: () => dispatch(userIsIdleAction()),
})

// withServerResponse allows us to set status code and make redirects from render()
export default withServerResponse(
  // withRedux auto-creates the Redux store when getInitialProps is called,
  // transfering state from server to client is handled automatically
  // @see https://github.com/kirill-konshin/next-redux-wrapper#how-it-works
  withRedux(makeStore)(
    withReduxSaga(
      appWithTranslation(
        connect(null, mapDispatchToProps)(FCPApp),
      ),
    ),
  ),
)
