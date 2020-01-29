import React from "react"

interface IProps {
  size: number
}

export default class Message extends React.Component<IProps> {
  public render() {
    return (
      <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 28 24" height={this.props.size}>
        <path fill="currentColor" d="M27.5.4c-.2-.2-.6-.4-1.1-.4-.2 0-.5 0-.8.1l-23.9 8C.3 8.6.1 9.4 0 9.8c0 .4.1 1.3 1.3 2L8.7 16v5.7c0 1.6.7 2.1 1.1 2.2a.9.9 0 0 0 .5.1c.6 0 1.2-.4 1.8-1.1l2.9-3.3 4.6 2.6c.6.3 1.2.4 1.8.2s1-.7 1.2-1.3L28 2.4c.1-1.1-.3-1.7-.5-2zM9.2 14.5l-7.1-4.1c-.5-.2-.6-.4-.6-.4 0-.1.2-.2.7-.4l22.4-7.5L9.2 14.5zm1.8 7.4c-.3.3-.5.5-.6.5 0-.1-.1-.3-.1-.8v-4.8l3.4 1.9-2.7 3.2zm10-1.3c0 .2-.1.3-.3.3-.1 0-.3 0-.4-.1l-9.7-5.6L26.1 2.8 21 20.6z" />
      </svg>
    )
  }
}
