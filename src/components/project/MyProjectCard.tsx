import React, { useEffect, useState } from "react"
import { Card, CardBody, CardHeader, Collapse } from "reactstrap"

import { IProject, ProjectState } from "api/schema"
import Icon from "components/common/Icon"
import { useTranslation } from "services/i18n"
import ProjectStatus from "./ProjectStatus"

interface IProps {
  project: IProject
}

const hashMatchesProject = (project) => {
  if (!process.browser) {
    return false
  }

  if (!window.location.hash) {
    return false
  }

  return window.location.hash === "#project-" + project.id
}

const MyProjectCard: React.FC<IProps> = ({ project }: IProps) => {
  const { t } = useTranslation()
  const [isOpen, setIsOpen] = useState(false)
  const toggle = () => { setIsOpen(!isOpen) }
  useEffect(() => { setIsOpen(hashMatchesProject(project)) }, [])

  return (
    <Card role="my project info" className="collapse-card">
      <CardHeader
        className="toggler"
        onClick={toggle}
        aria-expanded="false"
      >
        <div className="title-section">
          <h3 className={project.state === ProjectState.DEACTIVATED || project.state === ProjectState.INACTIVE ? t("text-muted") : ""}>
            {project.name ? project.name : t("project.unnamed")}
          </h3>
          <span>
            {t("page.projects.index.project.subHeader", // @todo eigene Übersetzung oder key verallgemeinern
              {
                date: project.createdAt,
                user: project.createdBy ? project.createdBy.username : t("user.unknown"),
              })}
            {project.state === ProjectState.DEACTIVATED && (" - " + t("project.state.deactivated"))}
            {project.state === ProjectState.INACTIVE && (" - " + t("project.state.inactive"))}
          </span>
        </div>
        <span className={"caret" + (isOpen ? " caret-toggled" : "")}><Icon name="caret" size={24} /></span>
      </CardHeader>
      <Collapse isOpen={isOpen}>
        <CardBody>
          <ProjectStatus project={project} />
        </CardBody>
      </Collapse>
    </Card>
  )
}

export default MyProjectCard
