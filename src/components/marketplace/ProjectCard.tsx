import Link from "next/link"
import React from "react"
import { Card, CardBody, CardHeader } from "reactstrap"

import { IProject } from "api/schema"
import DropdownComponent from "components/common/DropdownComponent"
import Icon from "components/common/Icon"
import TranslatedHtml from "components/common/TranslatedHtml"
import { useTranslation } from "services/i18n"
import { Routes, routeWithParams } from "services/routes"

interface IProps {
  project: IProject
}

const ProjectCard: React.FC<IProps> = ({ project }) => {
  const { t } = useTranslation()

  return <Card className="marketplace-card">
    <CardHeader>
      <div className="title-section">
        <h3>
          {project.name
            ? <Link href={Routes.PROJECT_PAGE}
              as={routeWithParams(Routes.PROJECT_PAGE, { slug: project.slug })}
            >
              <a>
                {project.name}
              </a>
            </Link>
            : <Link href={Routes.PROJECT_PAGE}
              as={routeWithParams(Routes.PROJECT_PAGE, { slug: project.id })}
            >
              <a>{t("project.unnamed")}</a>
            </Link>
          }
        </h3>
        <span><TranslatedHtml content="page.projects.index.project.subHeader" // HTML because the translated date might contain "&#x2F;"" for slashes
          params={{
            date: project.createdAt,
            user: project.createdBy ? project.createdBy.username : t("user.unknown"),
          }} /></span>
      </div>

      <DropdownComponent button={<Icon name="user-add" size={24} />} title={t("goto.memberApplication")}>
        <Link href={Routes.PROJECT_APPLICATION}
          as={routeWithParams(Routes.PROJECT_APPLICATION, { slug: project.slug || project.id })}
        >
          <a>{t("goto.memberApplication")}</a>
        </Link>
      </DropdownComponent>

    </CardHeader>
    <CardBody>
      <p>{project.shortDescription}</p>
    </CardBody>
  </Card>
}

export default ProjectCard
