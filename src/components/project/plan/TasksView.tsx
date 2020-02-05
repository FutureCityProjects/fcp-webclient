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
        <h3>{t("project.tasks")}</h3>
      </div>
      <div className={"icon-navigation"}>
        <Link
          href={Routes.PROJECT_PLAN_TASKS}
          as={routeWithParams(Routes.PROJECT_PLAN_TASKS, { slug: project.slug || project.id })}
        >
          <a aria-label={t("goto.editProjectTasks")} className="navigation-item" title={t("goto.editProjectTasks")}>
            <Icon name={"pencil"} size={24} />
          </a>
        </Link>
      </div>
    </CardHeader>
    <CardBody>
      {t("project.tasks")}: {project.tasks ? project.tasks.length : 0}
      <br />
      {t("project.workPackages")}: {project.workPackages ? project.workPackages.length : 0}
    </CardBody>
  </Card>
}

export default TasksView
