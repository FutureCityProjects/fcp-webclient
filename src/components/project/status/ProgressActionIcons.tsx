import Link from "next/link"
import React from "react"

import { IProject } from "api/schema"
import Icon from "components/common/Icon"
import { useTranslation } from "services/i18n"
import { Routes, routeWithParams } from "services/routes"

interface IProps {
  project: IProject
}

const ProgressActionIcons: React.FC<IProps> = ({ project }: IProps) => {
  const { t } = useTranslation()

  return <div role="actions" className="icon-navigation">
    <Link href={Routes.PROJECT_MEMBERS}
      as={routeWithParams(Routes.PROJECT_MEMBERS, { slug: project.slug || project.id })}
    >
      <a className="navigation-item" title={t("goto.projectMemberships")} aria-label={t("goto.projectMemberships")}>
        <Icon name="user-multiple" size={24} />
      </a>
    </Link>
    {/* <Link href="/">
      <a aria-label="add participants" className="navigation-item">
        <Icon name={"user-multiple"} size={24} />
      </a>
    </Link>
    <Link href="/">
      <a aria-label="download"  className="navigation-item">
        <Icon name={"download-cloud"} size={24} />
      </a>
</Link>*/}
  </div>
}

export default ProgressActionIcons
