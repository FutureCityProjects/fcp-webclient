import React from "react"

import ActiveLink from "components/common/ActiveLink"
import { useTranslation } from "services/i18n"

interface IProps {
  as?: string
  href: string
  label: string
}

const NavLink: React.FC<IProps> = ({ as, href, label }) => {
  const { t } = useTranslation()

  return <ActiveLink href={href} as={as}>
    <a title={t(label)}>{t(label)}</a>
  </ActiveLink>
}

export default NavLink
