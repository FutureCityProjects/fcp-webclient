import React from "react"

import Icon from "components/Icon"

export default class SocialLinks extends React.Component {
  public render() {
    return (
      <div className="social-icons">
        <a aria-label="Instagram"  href=""><Icon name={"instagram"} size={24} /></a>
        <a aria-label="Twitter"  href=""><Icon name={"twitter"} size={24} /></a>
        <a aria-label="Facebook"  href=""><Icon name={"facebook"} size={24} /></a>
      </div>
    )
  }
}
