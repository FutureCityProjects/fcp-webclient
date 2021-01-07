import React from "react"

import Icon from "components/common/Icon"

const SocialLinks: React.FC = () => <div className="social-icons">
  <a aria-label="Instagram" href=""><Icon name={"instagram"} size={24} /></a>
  <a aria-label="Twitter" href=""><Icon name={"twitter"} size={24} /></a>
  <a aria-label="Facebook" href=""><Icon name={"facebook"} size={24} /></a>
</div>

export default SocialLinks