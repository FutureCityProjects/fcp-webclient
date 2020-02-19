import React from "react"
import { Card, CardBody, CardHeader } from "reactstrap"

import Icon from "components/common/Icon"
import TranslatedHtml from "components/common/TranslatedHtml"
import Link from "next/link"
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
          href={Routes.PROJECT_PLAN_TASKS}
          as={routeWithParams(Routes.PROJECT_PLAN_TASKS, { slug: project.slug || project.id })}
        >
          <a className="btn btn-inline" aria-label={t("goto.editProjectTasks")} title={t("goto.editProjectTasks")}>
            <Icon name={"pencil"} size={24} />
          </a>
        </Link>
      </p>

      {tasks.length > 1 && <p>
        {t("project.workPackages")}: {workPackages.length}
        <Link
          href={Routes.PROJECT_PLAN_WORK_PACKAGES}
          as={routeWithParams(Routes.PROJECT_PLAN_WORK_PACKAGES, { slug: project.slug || project.id })}
        >
          <a className="btn btn-inline" aria-label={t("goto.editWorkPackages")} title={t("goto.editWorkPackages")}>
            <Icon name={"pencil"} size={24} />
          </a>
        </Link>
      </p>}

      {tasks.length > 0 && <p>
        {t("project.resourceRequirements")}: {resourceRequirements.length}
        <Link
          href={Routes.PROJECT_PLAN_RESOURCE_REQUIREMENTS}
          as={routeWithParams(Routes.PROJECT_PLAN_RESOURCE_REQUIREMENTS, { slug: project.slug || project.id })}
        >
          <a className="btn btn-inline" aria-label={t("goto.editResourceRequirements")} title={t("goto.editResourceRequirements")}>
            <Icon name={"pencil"} size={24} />
          </a>
        </Link>
      </p>}

      {tasks.length > 1 && <>
        <h5>{t("page.projects.plan.index.timetable")} <Link
          href={Routes.PROJECT_PLAN_TIMETABLE}
          as={routeWithParams(Routes.PROJECT_PLAN_TIMETABLE, { slug: project.slug || project.id })}
        >
          <a className="btn btn-inline" aria-label={t("goto.editTimetable")} title={t("goto.editTimetable")}>
            <Icon name={"pencil"} size={24} />
          </a>
        </Link></h5>
        {t("project.implementationTime")}: {project.implementationTime
          ? t("default.months", { count: project.implementationTime })
          : t("default.empty")} <br />
        {t("project.implementationBegin")}: {project.implementationBegin
          ? <TranslatedHtml content="default.longMonthYear" params={{ value: project.implementationBegin }} />
          : t("default.empty")}

      </>}
    </CardBody>
  </Card>
}

export default TasksView
