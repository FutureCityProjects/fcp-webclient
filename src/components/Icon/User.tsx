import React from "react"

interface IProps {
  size: number
}

export default class User extends React.Component<IProps> {
  public render() {
    return (
      <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 23.63" height={this.props.size}>
        <path fill="currentColor" d="M10 .3a6.31 6.31 0 0 0-3.6 2.66 6.94 6.94 0 0 0 4.16 10.78 6.93 6.93 0 0 0 8.1-8.17A6.85 6.85 0 0 0 10 .31zm4.18 2A5 5 0 0 1 17 6.96a5 5 0 0 1-5 5.1 5 5 0 0 1-5.05-5.1 5 5 0 0 1 7.19-4.64zM4.35 16.82A6 6 0 0 0 0 22.65c0 1 0 1 .82 1s.82 0 1-1.28a4.33 4.33 0 0 1 2.15-3.39c1.26-.6 14.8-.6 16 0s1.8 1.54 2.1 3.24c.26 1.42.3 1.45 1.1 1.45h.8l-.15-1.45a5.9 5.9 0 0 0-3.31-5c-.77-.4-1.54-.46-8.2-.5-4.06-.03-7.64.04-7.98.1z" />
      </svg>
    )
  }
}
