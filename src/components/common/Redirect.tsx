import Router from "next/router"
import React from "react"

import ServerResponseContext from "components/hoc/ServerResponseContext"

interface IProps {
  route: string
}

/**
 * Allows to trigger a redirect from the render() function.
 */
export default function Redirect({ route }: IProps) {
  if (process.browser) {
    Router.push(route)
    return null
  }

  return (
    <ServerResponseContext.Consumer>
      {(response) => {
        response.writeHead(302, {
          Location: route,
        })
        response.end()
        return null
      }}
    </ServerResponseContext.Consumer>
  )
}
