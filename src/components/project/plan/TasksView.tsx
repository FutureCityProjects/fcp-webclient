import Link from "next/link"
import React from "react"
import { Card, CardBody, CardHeader } from "reactstrap"

import Icon from "components/common/Icon"
import { useTranslation } from "services/i18n"
import { Routes, routeWithParams } from "services/routes"
import { IPlanProps } from "../common/PlanContainer"

const TasksView: React.FC<IPlanProps> = (props: IPlanProps) => {
  const { t } = useTranslation()
  const { functions, project } = props

  const tasks = functions.getTasks()
  const resourceRequirements = functions.getResourceRequirements()
  const workPackages = functions.getWorkPackages()

  return <Card className="body-card">
    <CardHeader  >
      <div className="title-section" >
        <h3>{t("page.projects.plan.workHeader")}</h3>
      </div>
      <div className={"icon-navigation"}>

      </div>
    </CardHeader>
    <CardBody>
      <p>
        {t("project.tasks")}: {tasks.length}
        <Link
          href={Routes.projectPlanTasks}
          as={routeWithParams(Routes.projectPlanTasks, { slug: project.slug || project.id })}
        >
          <a className="btn btn-inline" aria-label={t("goto.editProjectTasks")} title={t("goto.editProjectTasks")}>
            <Icon name={"pencil"} size={24} />
          </a>
        </Link>
      </p>

      {tasks.length > 1 && <p>
        {t("project.workPackages")}: {workPackages.length}
        <Link
          href={Routes.projectPlanWorkPackages}
          as={routeWithParams(Routes.projectPlanWorkPackages, { slug: project.slug || project.id })}
        >
          <a className="btn btn-inline" aria-label={t("goto.editWorkPackages")} title={t("goto.editWorkPackages")}>
            <Icon name={"pencil"} size={24} />
          </a>
        </Link>
      </p>}

      {tasks.length > 0 && <>
        {t("project.resourceRequirements")}: {resourceRequirements.length}
        <Link
          href={Routes.projectPlanResourceRequirements}
          as={routeWithParams(Routes.projectPlanResourceRequirements, { slug: project.slug || project.id })}
        >
          <a className="btn btn-inline" aria-label={t("goto.editResourceRequirements")} title={t("goto.editResourceRequirements")}>
            <Icon name={"pencil"} size={24} />
          </a>
        </Link>
      </>}
    </CardBody>
  </Card>
}

export default TasksView
