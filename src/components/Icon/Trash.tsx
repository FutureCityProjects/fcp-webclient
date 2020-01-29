import React from "react"

interface IProps {
  color?: string
  size: number
}

export default class Trash extends React.Component<IProps> {
  public render() {
    const {color = "black" } = this.props
    return (
      <svg version="1.1" xmlns="http://www.w3.org/2000/svg" x="0px" y="0px"
        viewBox="0 0 512 512" height={this.props.size}>
        <g>
          <polygon fill={color} points="353.574,176.526 313.496,175.056 304.807,412.34 344.885,413.804 			"/>
          <rect fill={color} x="235.948" y="175.791" width="40.104" height="237.285"/>
          <polygon fill={color} points="207.186,412.334 198.497,175.049 158.419,176.52 167.109,413.804 			"/>
          <path fill={color} d="M17.379,76.867v40.104h41.789L92.32,493.706C93.229,504.059,101.899,512,112.292,512h286.74
            c10.394,0,19.07-7.947,19.972-18.301l33.153-376.728h42.464V76.867H17.379z M380.665,471.896H130.654L99.426,116.971h312.474
            L380.665,471.896z"/>
        </g>
      <g>
          <path fill={color} d="M321.504,0H190.496c-18.428,0-33.42,14.992-33.42,33.42v63.499h40.104V40.104h117.64v56.815h40.104V33.42
          C354.924,14.992,339.932,0,321.504,0z"/>
      </g>
      </svg>
    )
  }
}
