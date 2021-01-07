import React, { useEffect, useState } from "react"
import { Card, CardBody, CardHeader, Collapse } from "reactstrap"

import { IProject, IProjectMembership, MembershipRole, ProjectState } from "api/schema"
import Icon from "components/common/Icon"
import TranslatedHtml from "components/common/TranslatedHtml"
import { useTranslation } from "services/i18n"
import ProjectStatus from "./ProjectStatus"

interface IProps {
  deleteMembership: (membership: IProjectMembership, actions: any) => void
  isSingle?: boolean
  membership: IProjectMembership
  project: IProject
}

const hashMatchesProject = (project: IProject) => {
  if (!process.browser) {
    return false
  }

  if (!window.location.hash) {
    return false
  }

  return window.location.hash === "#project-" + project.id.toString()
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
            className={project.state === ProjectState.Deactivated
              || project.state === ProjectState.Inactive
              || membership.role === MembershipRole.Applicant ? t("text-muted") : ""}
          >
            {project.name ? project.name : t("project.unnamed")}
          </h3>
          <span>
            <TranslatedHtml content="page.projects.index.project.subHeader"  // HTML because the translated date might contain "&#x2F;"" for slashes
              // @todo eigene Übersetzung oder key verallgemeinern
              params={{
                date: project.createdAt,
                user: project.createdBy ? project.createdBy.username : t("user.unknown"),
              }} />
            {project.state === ProjectState.Deactivated && (" - " + t("project.state.deactivated"))}
            {project.state === ProjectState.Inactive && (" - " + t("project.state.inactive"))}
          </span>
        </div>
        <span className={"caret" + (isOpen ? " caret-toggled" : "")}><Icon name="caret" size={24} /></span>
      </CardHeader>
      <Collapse isOpen={isOpen}>
        <CardBody>
          {membership.role === MembershipRole.Applicant
            ? <>
              <TranslatedHtml content="page.user.projects.applicationOpen" />
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
