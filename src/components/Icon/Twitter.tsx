import React from "react"

interface IProps {
  size: number
}

export default class Twitter extends React.Component<IProps> {
  public render() {
    return (
      <svg height={this.props.size} viewBox="0 0 512 512" xmlns="http://www.w3.org/2000/svg">
        <path fill="currentColor" d="M161.014 464.013c193.208 0 298.885-160.07 298.885-298.885 0-4.546 0-9.072-.307-13.578 20.558-14.87 38.305-33.282 52.408-54.374-19.17 8.495-39.5 14.065-60.334 16.527C473.6 100.58 490.01 79.92 497.848 55.6a210.55 210.55 0 0 1-66.703 25.498c-19.862-21.12-47.602-33.112-76.593-33.112-57.682 0-105.145 47.464-105.145 105.144a105.21 105.21 0 0 0 2.722 23.773c-84.418-4.23-163.18-44.16-216.494-109.752-27.724 47.726-13.38 109.576 32.522 140.226A104.26 104.26 0 0 1 20.48 194.23v1.33c.014 49.814 35.447 93.11 84.275 102.974a104.9 104.9 0 0 1-47.431 1.802c13.727 42.685 53.31 72.108 98.14 72.95a210.83 210.83 0 0 1-130.458 45.056A213.69 213.69 0 0 1 0 416.827a297.42 297.42 0 0 0 161.014 47.104" />
      </svg>
    )
  }
}
