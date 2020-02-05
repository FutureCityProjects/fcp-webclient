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
      <AuthElement roles={props.roles} requiredRole={UserRole.PROCESS_OWNER}>
        <li><NavIcon href={Routes.FUND_OVERVIEW} icon="pot" title="goto.fundManagement" /></li>
      </AuthElement>
      <AuthElement roles={props.roles} requiredRole={UserRole.PROCESS_OWNER}>
        <li><NavIcon href={Routes.PROCESS_OVERVIEW} icon="to-do" title="goto.processManagement" /></li>
      </AuthElement>
      <AuthElement roles={props.roles} requiredRole={UserRole.ADMIN}>
        <li><NavIcon href={Routes.USER_OVERVIEW} icon="user-multiple" title="goto.userManagement" /></li>
      </AuthElement>
      <li><NavIcon href={Routes.MARKETPLACE} icon="light-bulb" title="goto.marketplace" /></li>
      <li><NavIcon href={Routes.ABOUT} icon="info-bubble" title="goto.about" /></li>
      <li><NavIcon href={Routes.MARKETPLACE} icon="search" title="goto.search" /></li>

      <li><DropdownComponent
        className="navigation-item"
        aria-label={t("navigation.user")}
        button={<Icon name="user" size={24} />}
        light={props.isFrontPage}
        title={t("navigation.user")}
      >
        <AuthElement roles={props.roles} requiredRole={UserRole.USER}>
          <NavLink href={Routes.USER_PROFILE} label="navigation.userProfile" />
        </AuthElement>
        <AuthElement roles={props.roles} requiredRole={UserRole.USER}>
          <NavLink href={Routes.MY_PROJECTS} label="navigation.myProjects" />
        </AuthElement>
        <AuthElement roles={props.roles} requiredRole={UserRole.USER}>
          <span aria-label={t("navigation.logout")} onClick={props.doLogout}>{t("navigation.logout")}</span>
        </AuthElement>
        <AuthElement roles={props.roles} requiredRole={UserRole.GUEST}>
          <NavLink href={Routes.LOGIN} label="navigation.login" />
        </AuthElement>
      </DropdownComponent></li>
    </ul>
  </nav>
}

export default HeaderIconNavigation
