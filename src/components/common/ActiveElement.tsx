import { Router, withRouter } from "next/router"
import React, { FunctionComponent } from "react"

interface IProps {
  href: string
  router: Router
  activeClassName?: string
}

const ActiveElement: FunctionComponent<IProps> = ({ router, href, ...props }) => {
  const child = React.Children.only(props.children) as React.ReactElement<any>

  const activeClassName = props.activeClassName ? props.activeClassName : "active"

  let className: string = child.props.className || ""

  // when part of the URL matches: we want dropdowns etc. to be shown as active if a subpage is active,
  // e.g. /users should be active when /users/16 is displayed
  if (router.pathname.includes(href)) {
    className = `${className} ${activeClassName}`.trim()
  }

  delete props.activeClassName

  return <>{React.cloneElement(child, { className })}</>
}

export default withRouter(ActiveElement)
