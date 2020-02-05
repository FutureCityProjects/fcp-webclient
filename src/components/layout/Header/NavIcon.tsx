import React from "react"

import ActiveLink from "components/common/ActiveLink"
import Icon from "components/common/Icon"
import { useTranslation } from "services/i18n"

interface IProps {
  as?: string
  href: string,
  icon: string
  title: string
}

const NavIcon: React.FC<IProps> = ({ as, href, icon, title }) => {
  const { t } = useTranslation()

  return <ActiveLink href={href} as={as}>
    <a
      aria-label={t(title)}
      title={t(title)}
      className="navigation-item"
    ><Icon name={icon} size={24} /></a>
  </ActiveLink>
}

export default NavIcon
