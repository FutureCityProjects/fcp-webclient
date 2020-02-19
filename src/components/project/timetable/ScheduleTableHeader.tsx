import React, { useState } from "react"

import { IProject } from "api/schema"
import Icon from "components/common/Icon"
import TranslatedHtml from "components/common/TranslatedHtml"
import { IPlanFunctions } from "components/project//common/PlanContainer"
import { useTranslation } from "services/i18n"
import ImplementationTimeForm from "./ImplementationTimeForm"

interface IProps {
  functions: IPlanFunctions
  project: IProject
  onSetImplementationTime: any
}

const ScheduleTableHeader: React.FC<IProps> = (props: IProps) => {
  const [timeModalOpen, setTimeModalOpen] = useState(false)
  const toggleTimeModal = () => setTimeModalOpen(!timeModalOpen)

  const { project, onSetImplementationTime } = props
  const { t } = useTranslation()

  const implementationBegin = props.functions.getImplementationBegin()
  const implementationEnd = new Date(implementationBegin)
  implementationEnd.setMonth(implementationEnd.getMonth() + project.implementationTime - 1)

  const yearCells = []
  const monthCells = []

  for (let i = 0; i < project.implementationTime; i++) {
    const currentMonth = new Date(implementationBegin)
    currentMonth.setMonth(currentMonth.getMonth() + i)

    const newYear = i === 0 || currentMonth.getMonth() === 1

    yearCells.push(<td key={i}>{newYear ? currentMonth.getFullYear() : ""}</td>)
    monthCells.push(<td key={i} className={newYear ? "first-of-year" : ""}>
      <div>
        <span><TranslatedHtml content="default.shortMonth" params={{ value: currentMonth }} /></span>
      </div>
    </td>)
  }

  return <thead className="timespan">
    <tr>
      <th />
      <th colSpan={project.implementationTime}>
        <div className={"timespan-display " + (project.implementationBegin && project.implementationTime ? "" : "timespan-undefined")} onClick={toggleTimeModal}>
          {t("page.projects.plan.timetable.timespan")} {project.implementationBegin && project.implementationTime
            && <><TranslatedHtml content="default.monthYear" params={{ value: project.implementationBegin }} /> - <TranslatedHtml content="default.monthYear" params={{ value: implementationEnd }} /></>}
          <span className="calendar" onClick={toggleTimeModal}>
            <Icon name="calendar" size={20} />
          </span>
        </div>
      </th>
    </tr>
    <tr className="years">
      <td />
      {yearCells}
    </tr>
    <tr className="months">
      <td />
      {monthCells}
    </tr>
    <ImplementationTimeForm
      project={project}
      onSubmit={onSetImplementationTime}
      toggle={toggleTimeModal}
      modalOpen={timeModalOpen}
    />
  </thead>
}

export default ScheduleTableHeader
