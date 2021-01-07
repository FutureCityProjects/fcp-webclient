import React, { ReactChild } from "react"

import ServerResponseContext from "components/hoc/ServerResponseContext"

type IProps = {
  children?: React.ReactChildren | ReactChild
  statusCode: number
}

/**
 * Allows to set a status code from the render() function for SSR.
 */
const StatusCode: React.FC<IProps> = ({ statusCode, children }: IProps) => {
  if (process.browser) {
    return <>{children}</>
  }

  return (
    <ServerResponseContext.Consumer>
      {(response) => {
        response.statusCode = statusCode
        return children
      }}
    </ServerResponseContext.Consumer>
  )
}

export default StatusCode