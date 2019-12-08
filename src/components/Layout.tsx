import Head from "next/head"
import React from "react"
import { connect } from "react-redux"
import { AnyAction, Dispatch } from "redux"

import { logoutAction } from "redux/actions/auth"
import { selectUsername } from "redux/reducer/auth"
import { AppState } from "redux/store"
import "../../styles/index.scss"
import Navigation from "./common/Navigation"

interface IProps {
  title?: string
  username: string
  children: any
  doLogout: () => void
}

function Layout(props: IProps) {
  return <>
    <Head>
      <title>{props.title ? props.title : "FCP"}</title>
      <meta charSet="utf-8" />
      <meta name="viewport" content="initial-scale=1.0, width=device-width" />
    </Head>

    <header>
      <Navigation username={props.username} doLogout={props.doLogout} />
    </header>

    <main className="container" role="main">
      {props.children}
    </main>

    <footer className="footer">
      <div className="container">
        <span className="text-muted">Place sticky footer content here.</span>
      </div>
    </footer>
  </>
}

const mapDispatchToProps = (dispatch: Dispatch<AnyAction>) => ({
  doLogout: () => dispatch(logoutAction()),
})

const mapStateToProps = (state: AppState) => ({
  username: selectUsername(state),
})

export default connect(mapStateToProps, mapDispatchToProps)(Layout)
