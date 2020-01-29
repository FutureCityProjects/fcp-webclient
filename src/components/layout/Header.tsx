import React from "react"

import HeaderIconNavigation from "components/layout/Header/HeaderIconNavigation"
import HeaderLogo from "components/layout/Header/HeaderLogo"

interface IProps {
  doLogout: () => void
  isFrontPage?: boolean
  pageTitle: string
  roles: string[]
  username: string
}

export default class Header extends React.Component<IProps> {
  public render() {
    return (
      <header>
        <div>
          <HeaderLogo isFrontPage={this.props.isFrontPage} />
          {!this.props.isFrontPage &&
            <span role="banner" className="page-title">{this.props.pageTitle}</span>
          }
          <HeaderIconNavigation
            doLogout={this.props.doLogout}
            isFrontPage={this.props.isFrontPage}
            roles={this.props.roles}
            username={this.props.username}
          />
        </div>
      </header>
    )
  }
}
