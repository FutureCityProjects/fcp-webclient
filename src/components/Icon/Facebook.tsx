import React from "react"

interface IProps {
  size: number
}

export default class Facebook extends React.Component<IProps> {
  public render() {
    return (
      <svg height={this.props.size} viewBox="0 0 512 512" xmlns="http://www.w3.org/2000/svg"
        clipRule="evenodd" strokeLinejoin="round" strokeMiterlimit="2">
        <path d="M374.244 285.825l14.105-91.961h-88.233v-59.677c0-25.159 12.325-49.682 51.845-49.682h40.116V6.214S355.67 0 320.864 0c-72.67 0-120.165 44.042-120.165 123.775v70.089h-80.777v91.961h80.777v222.31A320.565 320.565 0 00250.408 512c16.911 0 33.511-1.324 49.708-3.865v-222.31h74.128z" fill="currentColor" />
      </svg>
    )
  }
}
