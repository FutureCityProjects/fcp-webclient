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
    return <img className="header-logo" src="/assets/img/logo.svg" height="52" alt="PROJEKT.WERK.STADT" />
  }

  return <Link href={Routes.HOME}>
    <a className="header-logo" title={t("goto.home")}>
      <img src="/assets/img/logo.svg" height="52" alt="PROJEKT.WERK.STADT" />
    </a>
  </Link>
}

export default HeaderLogo
