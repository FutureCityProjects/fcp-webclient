import Icon from "components/common/Icon"
import Link from "next/link"
import React from "react"

const ProgressActionIcons: React.FC = () =>
  <div role="actions" className="icon-navigation">
    <Link href="/">
      <a aria-label="view participants" className="navigation-item">
        <Icon name={"user"} size={24} />
      </a>
    </Link>
    <Link href="/">
      <a aria-label="add participants" className="navigation-item">
        <Icon name={"user-multiple"} size={24} />
      </a>
    </Link>
    <Link href="/">
      <a aria-label="download"  className="navigation-item">
        <Icon name={"download-cloud"} size={24} />
      </a>
    </Link>
  </div>

export default ProgressActionIcons
