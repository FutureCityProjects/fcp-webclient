import React from "react";

export default class ProgressSubBox extends React.Component {
  render() {
    return <>
      <div aria-label={this.props.text + " info"}  className="sub-status-card ">
        <h3>{this.props.text}</h3>
      </div>
    </>;
  }
}
