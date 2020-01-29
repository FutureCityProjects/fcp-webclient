import React from "react"

interface IProps {
  size: number
}

export default class Caret extends React.Component<IProps> {
  public render() {
    return (
      <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" height={this.props.size}>
        <path fill="currentColor" d="M6.4 24c-.2 0-.4-.1-.6-.2-.3-.3-.3-.8 0-1.1L16.5 12 5.8 1.3C5.5 1 5.5.5 5.8.2c.3-.3.8-.3 1.1 0l11.2 11.2c.3.3.3.8 0 1.1L6.9 23.8c-.1.1-.3.2-.5.2z"/>
      </svg>
    )
  }
}
