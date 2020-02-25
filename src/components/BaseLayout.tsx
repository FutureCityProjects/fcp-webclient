import Head from "next/head"
import React from "react"
import { connect } from "react-redux"
import { AnyAction, Dispatch } from "redux"

import Footer from "components/layout/Footer"
import Header from "components/layout/Header"
import PageBody from "components/layout/PageBody"
import { logoutAction } from "redux/actions/auth"
import { AppState } from "redux/reducer"
import { selectRoles, selectUsername } from "redux/reducer/auth"

interface IProps {
  children: any
  doLogout: () => void
  isFrontPage?: boolean
  pageTitle: string
  roles: string[]
  username?: string
}

class BaseLayout extends React.Component<IProps> {
  public render() {
    return <>
      <Head>
        <title>{this.props.pageTitle}</title>
        <meta charSet="utf-8" />
        <meta name="viewport" content="initial-scale=1.0, width=device-width" />

        <link rel="apple-touch-icon" sizes="57x57" href="/apple-icon-57x57.png" />
        <link rel="apple-touch-icon" sizes="60x60" href="/apple-icon-60x60.png" />
        <link rel="apple-touch-icon" sizes="72x72" href="/apple-icon-72x72.png" />
        <link rel="apple-touch-icon" sizes="76x76" href="/apple-icon-76x76.png" />
        <link rel="apple-touch-icon" sizes="114x114" href="/apple-icon-114x114.png" />
        <link rel="apple-touch-icon" sizes="120x120" href="/apple-icon-120x120.png" />
        <link rel="apple-touch-icon" sizes="144x144" href="/apple-icon-144x144.png" />
        <link rel="apple-touch-icon" sizes="152x152" href="/apple-icon-152x152.png" />
        <link rel="apple-touch-icon" sizes="180x180" href="/apple-icon-180x180.png" />
        <link rel="icon" type="image/png" sizes="192x192" href="/android-icon-192x192.png" />
        <link rel="icon" type="image/png" sizes="32x32" href="/favicon-32x32.png" />
        <link rel="icon" type="image/png" sizes="96x96" href="/favicon-96x96.png" />
        <link rel="icon" type="image/png" sizes="16x16" href="/favicon-16x16.png" />
        <link rel="manifest" href="/manifest.json" />
        <meta name="msapplication-TileColor" content="#ffffff" />
        <meta name="msapplication-TileImage" content="/ms-icon-144x144.png" />
        <meta name="theme-color" content="#ffffff" />
      </Head>

      <div className={this.props.isFrontPage ? "page frontpage" : "page subpage"}>
        <Header
          doLogout={this.props.doLogout}
          isFrontPage={this.props.isFrontPage}
          pageTitle={this.props.pageTitle}
          roles={this.props.roles}
          username={this.props.username}
        />
        <PageBody>
          {this.props.children}
        </PageBody>
        <Footer isFrontPage={this.props.isFrontPage} />
      </div>
    </>
  }
}

const mapDispatchToProps = (dispatch: Dispatch<AnyAction>) => ({
  doLogout: () => dispatch(logoutAction("message.auth.logout")),
})

const mapStateToProps = (state: AppState) => ({
  roles: selectRoles(state),
  username: selectUsername(state),
})

export default connect(mapStateToProps, mapDispatchToProps)(BaseLayout)
