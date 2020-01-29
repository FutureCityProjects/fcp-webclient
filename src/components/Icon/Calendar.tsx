import React from "react"

interface IProps {
  size: number
}

export default class Calendar extends React.Component<IProps> {
  public render() {
    return (
      <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 22.9 19.5" height={this.props.size}>
        <path fill="currentColor" d="M21.4.9h-4.5V0h-1v.9h-4.6V0h-1v.9H6.1V0h-1v.9H1.5A1.54 1.54 0 0 0 0 2.4V18a1.54 1.54 0 0 0 1.5 1.5h19.9a1.54 1.54 0 0 0 1.5-1.5V2.4A1.54 1.54 0 0 0 21.4.9zm.5 17.1a.47.47 0 0 1-.5.5H1.5A.47.47 0 0 1 1 18V2.4a.47.47 0 0 1 .5-.5h3.6v.8h1v-.8h4.3v.8h1v-.8H16v.8h1v-.8h4.5a.47.47 0 0 1 .5.5V18zM2.7 4.4v1h4.6v-1H2.7zm5.7 0v1H14v-1H8.4zm6.7 0v1h5v-1h-5zM6.8 7.5v2.8h2.8V7.5H6.8zm1.8 1.9h-.8v-.9h.8v.9zM10 7.5v2.8h2.8V7.5H10zm1.9 1.9H11v-.9h.8v.9zm1.4-1.9v2.8h2.8V7.5h-2.8zm1.9 1.9h-.8v-.9h.8v.9zm1.4-1.9v2.8h2.9V7.5h-2.9zm1.9 1.9h-.9v-.9h.9v.9zm-15 1.4v2.9h2.9v-2.9H3.5zm1.8 1.9h-.8v-.9h.9v.9zm1.5-1.9v2.9h2.8v-2.9H6.8zm1.8 1.9h-.8v-.9h.8v.9zm1.4-1.9v2.9h2.8v-2.9H10zm1.9 1.9H11v-.9h.8v.9zm1.4-1.9v2.9h2.8v-2.9h-2.8zm1.9 1.9h-.8v-.9h.8v.9zm1.4-1.9v2.9h2.9v-2.9h-2.9zm1.9 1.9h-.9v-.9h.9v.9zm-15 1.4v2.8h2.9v-2.8H3.5zm1.8 1.8h-.8v-.8h.9v.8zm1.5-1.8v2.8h2.8v-2.8H6.8zm1.8 1.8h-.8v-.8h.8v.8zm1.4-1.8v2.8h2.8v-2.8H10zm1.9 1.8H11v-.8h.8v.8zm1.4-1.8v2.8h2.8v-2.8h-2.8zm1.9 1.8h-.8v-.8h.8v.8z" />
      </svg>
    )
  }
}
