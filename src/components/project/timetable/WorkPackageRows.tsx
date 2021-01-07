import React, { ReactElement, useState } from "react"

import { IWorkPackage } from "api/schema"
import Icon from "components/common/Icon"
import { IPlanFunctions } from "components/project/common/PlanContainer"
import { useTranslation } from "services/i18n"
import ScheduleTaskCell from "./ScheduleTaskCell"

interface IProps {
  functions: IPlanFunctions
  taskMonthCols: any
  workPackage: IWorkPackage
}

const WorkPackageRows: React.FC<IProps> = (props: IProps) => {
  const { functions, taskMonthCols, workPackage } = props
  const { t } = useTranslation()

  const [collapsed, setCollapsed] = useState(true)
  const toggleCollapse = () => setCollapsed(!collapsed)

  const implementationTime = functions.getImplementationTime()
  const workPackageMonths = (wp: IWorkPackage) => {
    const cols: ReactElement[] = []
    for (let i = 0; i < implementationTime; i++) {
      cols.push(<td key={i} className={functions.getWorkPackageMonths(wp.id).includes(i + 1) ? "active" : ""} />)
    }
    return cols
  }

  const onClick = functions.getWorkPackageTasks(workPackage.id).length
    ? toggleCollapse
    : null

  return <>
    <tr className="wp-row">
      <td>
        <div
          className={"work-package-card" + (functions.getWorkPackageTasks(workPackage.id).length ? "" : " no-tasks")}
          onClick={onClick}
        >
          {t("project.workPackage.abbreviation")}{workPackage.order}: {workPackage.name}
          {functions.getWorkPackageTasks(workPackage.id).length
            ? <span className={"caret" + (collapsed ? "caret-toggled" : "")}><Icon name="caret" size={24} /></span>
            : <></>}
        </div>
      </td>
      {workPackageMonths(workPackage)}
    </tr>
    {functions.getWorkPackageTasks(workPackage.id).map(task =>
      <tr key={task.id} className={"task-row " + (collapsed ? "d-none" : "")}>
        <ScheduleTaskCell
          availablePackages={functions.getWorkPackages()}
          task={task}
          onAssign={functions.updateTask}
        />
        {taskMonthCols(task)}
      </tr>
    )}
  </>
}

export default WorkPackageRows