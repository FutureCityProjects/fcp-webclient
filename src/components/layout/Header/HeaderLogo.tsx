import Link from "next/link"
import React from "react"

import { useTranslation } from "services/i18n"
import { Routes } from "services/routes"

interface IProps {
  isFrontPage?: boolean
}

const HeaderLogo: React.FC<IProps> = ({ isFrontPage }) => {
  const { t } = useTranslation()

  if (isFrontPage) {
    return <img className="header-logo" src="/assets/img/logo.svg" height="52" alt={"logo"} />
  }

  return <Link href={Routes.HOME}>
    <a title={t("goto.home")}>
      <img className="header-logo" src="/assets/img/logo.svg" height="52" alt={"logo"} />
    </a>
  </Link>
}

export default HeaderLogo
