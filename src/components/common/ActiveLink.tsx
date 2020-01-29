import Link from "next/link"
import { Router, withRouter } from "next/router"
import React from "react"

interface IProps {
  as?: string
  href: string,
  router: Router,
  activeClassName?: string
}

const ActiveLink: React.FC<IProps> = ({ router, children, href, ...props }) => {
  const child = React.Children.only(children) as React.ReactElement<any>

  const activeClassName = props.activeClassName ? props.activeClassName : "active"

  let className = child.props.className || ""

  // when the complete URL matches, we don't want links to be shown as active if only a subpage is active,
  // e.g. /projects should not be active when /projects/own is displayed
  if (router.pathname === href || (props.as && router.pathname === props.as)) {
    className = `${className} ${activeClassName}`.trim()
  }

  delete props.activeClassName

  return <Link href={href} passHref {...props}>{React.cloneElement(child, { className })}</Link>
}

export default withRouter(ActiveLink)
