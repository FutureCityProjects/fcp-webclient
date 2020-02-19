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

  const { onSetImplementationTime } = props
  const { t } = useTranslation()

  const implementationTime = props.functions.getImplementationTime()
  const implementationBegin = props.functions.getImplementationBegin()
  const implementationEnd = new Date(implementationBegin)
  implementationEnd.setMonth(implementationEnd.getMonth() + implementationTime - 1)

  const yearCells = []
  const monthCells = []

  for (let i = 0; i < implementationTime; i++) {
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
      <th colSpan={implementationTime}>
        <div className="timespan-display" onClick={toggleTimeModal}>
          {t("page.projects.plan.timetable.timespan")
          } <TranslatedHtml content="default.monthYear" params={{ value: implementationBegin }}
          /> - <TranslatedHtml content="default.monthYear" params={{ value: implementationEnd }} />
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
      implementationBegin={implementationBegin}
      implementationTime={implementationTime}
      onSubmit={onSetImplementationTime}
      toggle={toggleTimeModal}
      modalOpen={timeModalOpen}
    />
  </thead>
}

export default ScheduleTableHeader
