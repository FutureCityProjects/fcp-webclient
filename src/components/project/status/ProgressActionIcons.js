import Link from "next/link";
import React from "react";
import Icon from "components/Icon";

export default class ProgressActionIcons extends React.Component {
  render() {
    return <>
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
    </>;
  }
}
