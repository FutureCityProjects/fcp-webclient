import React from "react"
import { Card, CardBody, CardHeader } from "reactstrap"

import { IProject, IProjectTask } from "api/schema"
import DropdownComponent from "components/common/DropdownComponent"
import ConfirmationForm from "components/common/form/ConfirmationForm"
import Icon from "components/common/Icon"
import { IPlanProps } from "components/project/common/PlanContainer"
import Link from "next/link"
import { useTranslation } from "services/i18n"
import { Routes, routeWithParams } from "services/routes"
import ProjectScheduleTable from "./ProjectScheduleTable"

const ProjectTimetable: React.FC<IPlanProps> = ({ functions, project, updateProject }) => {
  const { t } = useTranslation()

  const toggleTaskMonth = (task: IProjectTask, month: number) => {
    if (task.months.includes(month))
      task.months.splice(task.months.indexOf(month), 1)
    else task.months.push(month)

    functions.updateTask(task)
  }

  const updateImplementationTime = (values: { implementationBegin: Date, implementationTime: number }) => {
    // reset to first day of month
    values.implementationBegin.setMonth(values.implementationBegin.getMonth(), 1)
    values.implementationBegin.setHours(0)
    values.implementationBegin.setMinutes(0)
    values.implementationBegin.setSeconds(0)

    functions.updateImplementationTime(
      values.implementationTime,
      values.implementationBegin
    )
  }

  return <Card className="body-card project-tasks work-packages schedule">
    <CardHeader>
      <div className="title-section">
        <h3>{project.name}</h3>
        <span>
          {t("page.projects.index.project.subHeader", // @todo eigene Übersetzung oder key verallgemeinern
            {
              date: project.createdAt,
              user: project.createdBy ? project.createdBy.username : t("user.unknown"),
            })}
        </span>
      </div>
      <DropdownComponent button={<Icon name="grid" size={26} />}>
        <Link
          href={Routes.PROJECT_PLAN}
          as={routeWithParams(Routes.PROJECT_PLAN, { slug: project.slug || project.id })}
        >
          <a>{t("goto.planOverview")}</a>
        </Link>
        <Link href={Routes.MY_PROJECTS} as={Routes.MY_PROJECTS + "#project-" + project.id}>
          <a>{t("goto.myProjects")}</a>
        </Link>
      </DropdownComponent>
    </CardHeader>
    <CardBody>
      <h3 className="card-title">{t("page.projects.plan.timetable.timetableHeader")}</h3>
      <span className="form-text">{t("page.projects.plan.timetable.timetableIntro")}</span>
      <div className="button-area">
        <ConfirmationForm
          buttonLabel="form.saveChanges"
          errorPrefix="project"
          onSubmit={(_values, actions) => {
            // only update the tasks, everything else should be unchanged, we don't want to overwrite other data meanwhile updated
            const update: IProject = {
              "@id": project["@id"],
              implementationBegin: project.implementationBegin,
              implementationTime: project.implementationTime,
              tasks: project.tasks,
            }

            updateProject(update, actions)
          }}
        />
      </div>
      <div className="card-content">
        <ProjectScheduleTable
          project={project}
          onSetImplementationTime={updateImplementationTime}
          toggleTaskMonth={toggleTaskMonth}
          functions={functions}
        />
      </div>
      <div className="button-area">
        <ConfirmationForm
          buttonLabel="form.saveChanges"
          errorPrefix="project"
          onSubmit={(_values, actions) => {
            // only update the tasks, everything else should be unchanged, we don't want to overwrite other data meanwhile updated
            const update: IProject = {
              "@id": project["@id"],
              implementationBegin: project.implementationBegin,
              implementationTime: project.implementationTime,
              tasks: project.tasks,
            }

            updateProject(update, actions)
          }}
        />
      </div>
    </CardBody>
  </Card>
}

export default ProjectTimetable
