import Link from "next/link"
import React from "react"
import { Card, CardBody, CardHeader } from "reactstrap"

import { IProject } from "api/schema"
import DropdownComponent from "components/common/DropdownComponent"
import Icon from "components/common/Icon"
import { useTranslation } from "services/i18n"
import { Routes, routeWithParams } from "services/routes"

interface IProps {
  project: IProject
}

const ProjectIdeaCard: React.FC<IProps> = ({ project }) => {
  const { t } = useTranslation()

  return <Card className="marketplace-card">
    <CardHeader>
      <h3>{t("page.projects.index.idea.header")}</h3>
      <DropdownComponent button={<Icon name="hand" size={24} />} title={t("goto.newProject")}>
        <Link href={routeWithParams(Routes.CreateProject, { id: project.id })}>
          <a>{t("goto.newProject")}</a>
        </Link>
      </DropdownComponent>
    </CardHeader>
    <CardBody>
      <p>{project.shortDescription}</p>
    </CardBody>
  </Card>
}

export default ProjectIdeaCard
