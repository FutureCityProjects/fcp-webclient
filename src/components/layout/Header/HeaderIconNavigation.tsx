import React from "react"

import { UserRole } from "api/schema"
import AuthElement from "components/common/AuthElement"
import DropdownComponent from "components/common/DropdownComponent"
import Icon from "components/common/Icon"
import { useTranslation } from "services/i18n"
import { Routes } from "services/routes"
import NavIcon from "./NavIcon"
import NavLink from "./NavLink"

interface IProps {
  doLogout: () => void
  isFrontPage?: boolean
  roles: string[]
  username: string
}

const HeaderIconNavigation: React.FC<IProps> = (props) => {
  const { t } = useTranslation()

  return <nav role="navigation" className="icon-navigation">
    <ul>
      <AuthElement roles={props.roles} requiredRole={UserRole.ProcessOwner}>
        <li><NavIcon href={Routes.FundOverview} icon="pot" title="goto.fundManagement" /></li>
      </AuthElement>
      <AuthElement roles={props.roles} requiredRole={UserRole.Admin}>
        <li><NavIcon href={Routes.UserOverview} icon="user-multiple" title="goto.userManagement" /></li>
      </AuthElement>
      <li><NavIcon href={Routes.Marketplace} icon="light-bulb" title="goto.marketplace" /></li>
      <li><NavIcon href={Routes.ProcessOverview} icon="info-bubble" title="goto.processOverview" /></li>
      {/* <li><NavIcon href={Routes.MARKETPLACE} icon="search" title="goto.search" /></li>*/}

      <li><DropdownComponent
        className="navigation-item"
        aria-label={t("navigation.user")}
        button={<Icon name="user" size={24} />}
        light={props.isFrontPage}
        title={t("navigation.user")}
      >
        <AuthElement roles={props.roles} requiredRole={UserRole.User}>
          <NavLink href={Routes.UserProfile} label="navigation.userProfile" />
        </AuthElement>
        <AuthElement roles={props.roles} requiredRole={UserRole.User}>
          <NavLink href={Routes.MyProjects} label="navigation.myProjects" />
        </AuthElement>
        <AuthElement roles={props.roles} requiredRole={UserRole.User}>
          <span aria-label={t("navigation.logout")} onClick={props.doLogout}>{t("navigation.logout")}</span>
        </AuthElement>
        <AuthElement roles={props.roles} requiredRole={UserRole.Guest}>
          <NavLink href={Routes.Login} label="navigation.login" />
        </AuthElement>
      </DropdownComponent></li>
    </ul>
  </nav>
}

export default HeaderIconNavigation
