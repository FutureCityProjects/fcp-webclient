import PropTypes from "prop-types"
import React from "react"
import ServerResponseContext from "./ServerResponseContext"

interface IProps {
  response: any
}

/**
 * We need a way to set the status code / create redirects not only in the getInisialProps
 * @see https://github.com/zeit/next.js/issues/4452
 */
const withServerResponse = (App) => {
  return class extends React.Component<IProps> {
    public static displayName = "withServerResponse(App)"

    public static propTypes = {
      response: PropTypes.func,
    }

    public static defaultProps = {
      response: () => null,
    }

    public static async getInitialProps(context) {
      const { ctx } = context
      let props = {}

      if (App.getInitialProps) {
        props = await App.getInitialProps(context)
      }

      return {
        ...props,
        response: () => ctx.res,
      }
    }

    public render() {
      const { response, ...props } = this.props

      if (process.browser) {
        return <App {...props} />
      }

      return (
        <ServerResponseContext.Provider value={response()}>
          <App {...props} />
        </ServerResponseContext.Provider>
      )
    }
  }
}

export default withServerResponse