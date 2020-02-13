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
