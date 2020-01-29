import React from "react"

interface IProps {
  size: number
}

export default class Check extends React.Component<IProps> {
  public render() {
    return (
      <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" height={this.props.size}>
        <path fill="currentColor" d="M12 0A12.04 12.04 0 0 0 0 12a12.04 12.04 0 0 0 12 12 12.04 12.04 0 0 0 12-12A12.04 12.04 0 0 0 12 0zm-1.9 17.6c-.3 0-.7-.1-.9-.4l-3.9-4c-.5-.5-.5-1.3 0-1.8.2-.2.5-.4.9-.4.3 0 .7.1.9.4l3 3.1 6.8-6.8c.2-.2.6-.4.9-.4s.6.1.9.4c.5.5.5 1.3 0 1.8L11 17.2c-.2.3-.6.4-.9.4z" />
      </svg>
    )
  }
}
