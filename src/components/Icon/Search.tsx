import React from "react"

interface IProps {
  size: number
}

export default class Search extends React.Component<IProps> {
  public render() {
    return (
      <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" height={this.props.size}>
        <path fill="currentColor" d="M8 .2a10.59 10.59 0 0 0-7.69 7.5 10.33 10.33 0 0 0 2.91 9.91 10.34 10.34 0 0 0 13.06.76c.4-.25.82.07 3.4 2.66l3 3 .67-.7.7-.67-3-2.95c-2.6-2.62-2.9-3-2.64-3.4a13.13 13.13 0 0 0 1.83-4.46A10.3 10.3 0 0 0 8 .21zm5 2.12a8.3 8.3 0 0 1 5.45 7.74 7.41 7.41 0 0 1-2.17 5.67 7.78 7.78 0 0 1-6.14 2.76A8.34 8.34 0 0 1 4.069 4.43 8.34 8.34 0 0 1 13 2.33z" />
      </svg>
    )
  }
}
