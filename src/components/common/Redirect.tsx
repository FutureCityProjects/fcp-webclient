import Router from "next/router"
import React from "react"

import ServerResponseContext from "components/hoc/ServerResponseContext"

interface IProps {
  route: string
}

/**
 * Allows to trigger a redirect from the render() function.
 */
const Redirect: React.FC<IProps> = ({ route }: IProps) => {
  if (process.browser) {
    void Router.push(route)
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

export default Redirect