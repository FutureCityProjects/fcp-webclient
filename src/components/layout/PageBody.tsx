import React from "react"

export default class PageBody extends React.Component {
  public render() {
    return (
      <main className="container" role="main">{this.props.children}</main>
    )
  }
}
