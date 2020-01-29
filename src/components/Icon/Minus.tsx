import React from "react"

interface IProps {
  color?: string
  size: number
}

export default class Minus extends React.Component<IProps> {
  public render() {
    return (
      <svg height={this.props.size} viewBox="0 -192 469.33333 469" xmlns="http://www.w3.org/2000/svg">
        <path fill={this.props.color} d="m437.332031.167969h-405.332031c-17.664062 0-32 14.335937-32 32v21.332031c0 17.664062 14.335938 32 32 32h405.332031c17.664063 0 32-14.335938 32-32v-21.332031c0-17.664063-14.335937-32-32-32zm0 0" />
      </svg>
    )
  }
}
