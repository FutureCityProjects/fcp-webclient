import React from "react"
import { Card, CardBody, CardHeader, UncontrolledCollapse } from "reactstrap"

import { IProject } from "api/schema"
import Icon from "components/Icon"
import { formatDate } from "services/dateFormat"
import { useTranslation } from "services/i18n"
import ProjectStatus from "./ProjectStatus"

interface IProps {
  project: IProject
}

function handleClick(id) {
  document.getElementById("caret-" + id).classList.toggle("caret-toggled")
}

const MyProjectCard: React.FC<IProps> = ({ project }: IProps) => {
  const { t } = useTranslation()

  return (
    <Card role="my project info" className="collapse-card">
      <CardHeader
        id={"toggler-" + project.id}
        className="toggler"
        onClick={() => handleClick(project.id)}
        aria-expanded="false"
      >
        <div className="title-section">
          <h3>
            {project.name ? project.name : t("project.unnamed")}
          </h3>
          <span>{t("page.projects.index.project.subHeader", // @todo eigene Übersetzung oder key verallgemeinern
            {
              date: formatDate(project.createdAt),
              user: project.createdBy ? project.createdBy.username : "user.unknown",
            })}</span>
        </div>
        <span id={"caret-" + project.id} className="caret"><Icon name="caret" size={24} /></span>
      </CardHeader>
      <UncontrolledCollapse toggler={"#toggler-" + project.id}>
        <CardBody>
          <ProjectStatus project={project} />
        </CardBody>
      </UncontrolledCollapse>
    </Card>
  )
}

export default MyProjectCard
