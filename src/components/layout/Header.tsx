import React from "react"
import { Col, Row } from "reactstrap"

import HeaderIconNavigation from "components/layout/Header/HeaderIconNavigation"
import HeaderLogo from "components/layout/Header/HeaderLogo"

interface IProps {
  doLogout: () => void
  isFrontPage?: boolean
  pageTitle: string
  roles: string[]
  username: string
}

const Header: React.FC<IProps> = (props: IProps) => <header >
  <Row>
    <Col><HeaderLogo isFrontPage={props.isFrontPage} /></Col>
    <Col>{!props.isFrontPage &&
      <span role="banner" className="page-title">{props.pageTitle}</span>
    }</Col>
    <Col><HeaderIconNavigation
      doLogout={props.doLogout}
      isFrontPage={props.isFrontPage}
      roles={props.roles}
      username={props.username}
    /></Col>
  </Row>
</header>

export default Header