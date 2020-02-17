import React, { useEffect, useState } from "react"
import { Card, CardBody, CardHeader, Collapse } from "reactstrap"

import { IProject, IProjectMembership, MembershipRole, ProjectState } from "api/schema"
import Icon from "components/common/Icon"
import { useTranslation } from "services/i18n"
import ProjectStatus from "./ProjectStatus"

interface IProps {
  deleteMembership: any
  isSingle?: boolean
  membership: IProjectMembership
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

const MyProjectCard: React.FC<IProps> = ({ deleteMembership, isSingle = false, membership, project }: IProps) => {
  const { t } = useTranslation()
  const [isOpen, setIsOpen] = useState(false)
  const toggle = () => { setIsOpen(!isOpen) }
  useEffect(() => { setIsOpen(isSingle || hashMatchesProject(project)) }, [])

  const confirmDeleteApplication = (application) => {
    if (confirm(t("message.project.confirmDelete.myApplication"))) {
      return deleteMembership(application, null)
    }

    return false
  }

  // failsave
  if (!membership) {
    return null
  }

  return (
    <Card role="my project info" className="collapse-card">
      <CardHeader
        className="toggler"
        onClick={toggle}
        aria-expanded="false"
      >
        <div className="title-section">
          <h3
            className={project.state === ProjectState.DEACTIVATED
              || project.state === ProjectState.INACTIVE
              || membership.role === MembershipRole.APPLICANT ? t("text-muted") : ""}
          >
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
          {membership.role === MembershipRole.APPLICANT
            ? <>
              {t("page.user.projects.applicationOpen")}
              <a className="btn btn-inline" onClick={() => confirmDeleteApplication(membership)}
                title={t("page.user.projects.deleteMyApplication")}>
                <Icon name="trash" size={24} />
              </a>
            </>
            : <ProjectStatus project={project} />
          }
        </CardBody>
      </Collapse>
    </Card>
  )
}

export default MyProjectCard
