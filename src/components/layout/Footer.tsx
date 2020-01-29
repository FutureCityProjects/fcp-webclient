import React from "react"

import SocialLinks from "./SocialLinks"

export default class Footer extends React.Component {
  public render() {
    return (
      <footer>
        <div className="footer-content">
          <SocialLinks />
        </div>
      </footer>
    )
  }
}
