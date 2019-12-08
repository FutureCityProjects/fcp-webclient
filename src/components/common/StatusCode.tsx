import PropTypes from "prop-types"
import React from "react"

import ServerResponseContext from "components/hoc/ServerResponseContext"

/**
 * Allows to set a status code from the render() function for SSR.
 */
export default function StatusCode({ statusCode, children }) {
  if (process.browser) {
    return children
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

StatusCode.propTypes = {
  children: PropTypes.any,
  statusCode: PropTypes.number.isRequired,
}

StatusCode.defaultProps = {
  children: null,
}
