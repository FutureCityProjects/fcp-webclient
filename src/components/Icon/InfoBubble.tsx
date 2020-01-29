import React from "react"

interface IProps {
  size: number
}

export default class InfoBubble extends React.Component<IProps> {
  public render() {
    return (
      <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 22.53" width={this.props.size}>
        <path fill="currentColor" d="M4 .27A6.62 6.62 0 0 0 .29 4.2 70.05 70.05 0 0 0 0 13.27v7.9l.7.7c1.18 1.18 1.8 1 4.56-1.27L7 19.15l6.23-.1c6.76-.1 7.15-.17 8.77-1.54s1.9-2.18 2-7.24c.12-5.9-.07-6.77-1.76-8.46A4.74 4.74 0 0 0 19.8.27C18.36-.1 5.44-.1 4 .27zm15 1.67a4 4 0 0 1 2.72 2c.42.7.5 1.37.6 4.75.1 4.7-.15 6.1-1.28 7.16-1.34 1.27-1.42 1.3-8.13 1.3H6.57l-2.23 1.83C3 20.1 2 20.74 1.9 20.62a74.27 74.27 0 0 1-.15-8c.08-7.3.1-7.87.57-8.65a4.12 4.12 0 0 1 2.6-2A117.44 117.44 0 0 1 19 1.94zM11.3 4c-.76.9.22 2.53 1.15 2S13 3.66 12 3.66a1 1 0 0 0-.7.34zm0 3.68c-.2.22-.27 1.47-.22 3.82.07 3 .12 3.53.5 3.78a.72.72 0 0 0 .86 0c.37-.25.42-.76.5-3.78.07-3.6 0-4.16-.93-4.16a1 1 0 0 0-.71.34z" />
      </svg>
    )
  }
}
