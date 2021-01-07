import React, { ReactElement } from "react"
import { Table } from "reactstrap"

import { IProject } from "api/schema"
import { IPlanFunctions } from "components/project/common/PlanContainer"
import ScheduleTableHeader from "./ScheduleTableHeader"
import ScheduleTaskCell from "./ScheduleTaskCell"
import TogglableTaskMonthCell from "./TogglableTaskMonthCell"
import WorkPackageRows from "./WorkPackageRows"

interface IProps {
  project: IProject
  onSetImplementationTime: any
  toggleTaskMonth?: any
  functions?: IPlanFunctions
}

const ProjectScheduleTable: React.FC<IProps> = (props: IProps) => {
  const { project, onSetImplementationTime, toggleTaskMonth, functions } = props

  const implementationTime = functions.getImplementationTime()
  const implementationBegin = functions.getImplementationBegin()

  const taskMonthCols = (task) => {
    const cols: ReactElement[] = []

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

  const workPackageRows = functions.getWorkPackages().map((wp) => <WorkPackageRows
    key={wp.id}
    functions={functions}
    taskMonthCols={taskMonthCols}
    workPackage={wp}
  />)

  return <Table className="project-schedule-table">
    <ScheduleTableHeader
      functions={functions}
      project={project}
      onSetImplementationTime={onSetImplementationTime}
    />
    <tbody>
      {unassignedTaskRows}
      {workPackageRows}
    </tbody>
  </Table>
}

export default ProjectScheduleTable
