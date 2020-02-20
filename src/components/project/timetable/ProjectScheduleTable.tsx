import React from "react"
import { Table, UncontrolledCollapse } from "reactstrap"

import { IProject, IWorkPackage } from "api/schema"
import Icon from "components/common/Icon"
import { IPlanFunctions } from "components/project/common/PlanContainer"
import { useTranslation } from "services/i18n"
import ScheduleTableHeader from "./ScheduleTableHeader"
import ScheduleTaskCell from "./ScheduleTaskCell"
import TogglableTaskMonthCell from "./TogglableTaskMonthCell"

interface IProps {
  project: IProject
  onSetImplementationTime: any
  toggleTaskMonth?: any
  functions?: IPlanFunctions
}

const ProjectScheduleTable: React.FC<IProps> = (props: IProps) => {
  const { project, onSetImplementationTime, toggleTaskMonth, functions } = props
  const { t } = useTranslation()

  const implementationTime = functions.getImplementationTime()
  const implementationBegin = functions.getImplementationBegin()

  const taskMonthCols = (task) => {
    const cols = []

    for (let i = 0; i < implementationTime; i++) {
      const currentMonth = new Date(implementationBegin)
      currentMonth.setMonth(currentMonth.getMonth() + i)

      const newYear = i === 0 || currentMonth.getMonth() === 0

      cols.push(<TogglableTaskMonthCell
        key={i}
        onClick={toggleTaskMonth}
        month={i + 1}
        task={task}
        active={task.months.includes(i + 1)}
        className={newYear ? "first-of-year" : ""}
      />)
    }
    return cols
  }

  const unassignedTaskRows = functions.getWorkPackageTasks(null).map((task) => <tr key={task.id} className="task-row">
    <ScheduleTaskCell
      availablePackages={functions.getWorkPackages()}
      task={task}
      onAssign={functions.updateTask}
    />
    {taskMonthCols(task)}
  </tr>)

  const workPackageMonths = (wp: IWorkPackage) => {
    const cols = []
    for (let i = 0; i < implementationTime; i++) {
      cols.push(<td key={i} className={functions.getWorkPackageMonths(wp.id).includes(i + 1) ? "active" : ""} />)
    }
    return cols
  }

  const workPackageRows = functions.getWorkPackages().map((wp) => <div key={wp.id} className="wp-collapse">
    <tr className="wp-row">
      <td>
        <div className={"work-package-card" + (functions.getWorkPackageTasks(wp.id).length ? "" : " no-tasks")} id={"toggle-" + wp.id}>
          {t("project.workPackage.abbreviation")}{wp.order}: {wp.name}
          {functions.getWorkPackageTasks(wp.id).length ? <span className="caret"><Icon name="caret" size={24} /></span> : <></>}
        </div>
      </td>
      {workPackageMonths(wp)}
    </tr>
    <UncontrolledCollapse toggler={"toggle-" + wp.id}>
      {
        functions.getWorkPackageTasks(wp.id).map(task =>
          <tr key={task.id} className="task-row">
            <ScheduleTaskCell
              availablePackages={functions.getWorkPackages()}
              task={task}
              onAssign={functions.updateTask}
            />
            {taskMonthCols(task)}
          </tr>)
      }
    </UncontrolledCollapse>
  </div>)

  return <Table className="project-schedule-table">
    <ScheduleTableHeader
      functions={functions}
      project={project}
      onSetImplementationTime={onSetImplementationTime}
    />
    <tbody>
      {unassignedTaskRows}
      <div className="wp-area">{workPackageRows}</div>
    </tbody>
  </Table>
}

export default ProjectScheduleTable
