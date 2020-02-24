import React from "react"
import { Card, CardBody } from "reactstrap"

import { IProjectTask, IWorkPackage } from "api/schema"
import DropdownComponent from "components/common/DropdownComponent"
import Icon from "components/common/Icon"
import { useTranslation } from "services/i18n"

interface IProps {
  availablePackages: IWorkPackage[]
  onAssign?: any
  onDelete?: any
  task: IProjectTask
}

const TaskCard: React.FC<IProps> = (props: IProps) => {
  const { t } = useTranslation()
  const { availablePackages, onAssign, onDelete, task } = props

  const wrappedPackages = availablePackages.map((workPackage) =>
    <a
      key={workPackage.id}
      onClick={() => onAssign({ ...task, workPackage: workPackage.id })}
      title={t("project.workPackage.abbreviation") + workPackage.order + ": " + workPackage.name}
    >
      {t("project.workPackage.abbreviation") + workPackage.order + ": " + workPackage.name.substr(0, 23)}{workPackage.name.length > 23 && "…"}
    </a>
  )

  return <Card className="task-card">
    <CardBody>
      <div className="icon-navigation">
        <a
          aria-label={t("form.removeElement")}
          className="navigation-item"
          onClick={() => { onDelete(task.id) }}
          title={t("form.removeElement")}
        >
          <Icon name="trash" size={18} />
        </a>
        <DropdownComponent
          button={<Icon name="sort" size={18} />}
          className="navigation-item"
          title={t("form.project.tasks.assignWorkPackage")}
        >
          {wrappedPackages}
        </DropdownComponent>
      </div>
      <p>{task.description}</p>
    </CardBody>
  </Card>
}

export default TaskCard
