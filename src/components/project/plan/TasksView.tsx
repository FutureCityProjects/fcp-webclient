import React from "react"
import { Card, CardBody, CardHeader } from "reactstrap"

import { IProject } from "api/schema"
import Icon from "components/common/Icon"
import Link from "next/link"
import { useTranslation } from "services/i18n"
import { Routes, routeWithParams } from "services/routes"

interface IProps {
  project: IProject
}

const TasksView: React.FC<IProps> = (props: IProps) => {
  const { t } = useTranslation()
  const { project } = props

  return <Card className="body-card">
    <CardHeader  >
      <div className="title-section" >
        <h3>{t("page.projects.plan.workHeader")}</h3>
      </div>
      <div className={"icon-navigation"}>

      </div>
    </CardHeader>
    <CardBody>
      {t("project.tasks.label")}: {project.tasks ? project.tasks.length : 0}
      <Link
        href={Routes.PROJECT_PLAN_TASKS}
        as={routeWithParams(Routes.PROJECT_PLAN_TASKS, { slug: project.slug || project.id })}
      >
        <a className="btn btn-inline" aria-label={t("goto.editProjectTasks")} title={t("goto.editProjectTasks")}>
          <Icon name={"pencil"} size={24} />
        </a>
      </Link>
      <br />
      {t("project.workPackages.label")}: {project.workPackages ? project.workPackages.length : 0}
      <Link
        href={Routes.PROJECT_PLAN_WORK_PACKAGES}
        as={routeWithParams(Routes.PROJECT_PLAN_WORK_PACKAGES, { slug: project.slug || project.id })}
      >
        <a className="btn btn-inline" aria-label={t("goto.editWorkPackages")} title={t("goto.editWorkPackages")}>
          <Icon name={"pencil"} size={24} />
        </a>
      </Link><br />
      {t("project.resourceRequirements.label")}: {project.resourceRequirements ? project.resourceRequirements.length : 0}
      <Link
        href={Routes.PROJECT_PLAN_RESOURCE_REQUIREMENTS}
        as={routeWithParams(Routes.PROJECT_PLAN_RESOURCE_REQUIREMENTS, { slug: project.slug || project.id })}
      >
        <a className="btn btn-inline" aria-label={t("goto.editResourceRequirements")} title={t("goto.editResourceRequirements")}>
          <Icon name={"pencil"} size={24} />
        </a>
      </Link>
    </CardBody>
  </Card>
}

export default TasksView
