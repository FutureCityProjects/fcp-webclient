import React from "react"

import { IProjectTask } from "api/schema"

interface IProps {
  task: IProjectTask
  month: number
  active: boolean
  className?: string
  onClick?: (task: IProjectTask, month: number) => void
}

const TogglableTaskMonthCell: React.FC<IProps> = (props: IProps) => {
  const { active, task, month, className, onClick } = props

  return <td className={className + (active ? " active" : "")} onClick={() => onClick(task, month)} />
}

export default TogglableTaskMonthCell
