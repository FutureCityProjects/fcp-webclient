import React, { useState } from "react"
import { Card, CardBody, CardHeader, Collapse, UncontrolledTooltip } from "reactstrap"

import { IProject } from "api/schema"
import Icon from "components/common/Icon"
import { useTranslation } from "services/i18n"
import TaskCard from "./TaskCard"
import WorkPackageModal from "./WorkPackageModal"

interface IProps {
  currentPackage: string
  project: IProject
  onEdit: any
  onDelete: any
  onTaskDelete: any
  onTaskAssign: any
}

const WorkPackageCard: React.FC<IProps> = (props: IProps) => {
  const { t } = useTranslation()
  const { currentPackage, onDelete, onTaskDelete, onTaskAssign, onEdit, project } = props

  const [isOpen, setIsOpen] = useState(true)
  const toggleCollapse = () => setIsOpen(!isOpen)

  const [editModalOpen, setEditModalOpen] = useState(false)
  const toggleEditModal = () => setEditModalOpen(!editModalOpen)

  const workPackage = project.workPackages.find((wp) => wp.id === currentPackage)
  const tasks = project.tasks.filter((task) => task.workPackage === currentPackage)

  const currentTasks = tasks.map((task) => <TaskCard
    availablePackages={project.workPackages.filter((wp) => wp.id !== currentPackage)}
    key={task.id}
    onAssign={onTaskAssign}
    onDelete={onTaskDelete}
    task={task}
  />)

  return <Card className="work-package-card">
    <CardHeader onClick={toggleCollapse}>
      <h4 id={"wp-" + workPackage.id}>{workPackage.name.substr(0, 23)}{workPackage.name.length > 23 && "…"}</h4>
      {workPackage.name.length > 23 && <UncontrolledTooltip target={"wp-" + workPackage.id}>{workPackage.name}</UncontrolledTooltip>}
      <Icon name="caret" size={28} />
    </CardHeader>

    <Collapse isOpen={isOpen}>
      <CardBody>
        {workPackage.description &&
          <p className="work-package-description">{workPackage.description}</p>}
        {currentTasks.length > 0
          ? currentTasks
          : <p className="no-tasks">Noch keine Aufgaben zugewiesen</p>
        }
      </CardBody>
    </Collapse>
    <div className="card-footer">
      <div className="task-count">
        <Icon name="to-do" size={18} />
        <span>{currentTasks.length}</span>
      </div>
      {workPackage.mainResponsibility && <div>
        <Icon name="user" size={16} />
        <span>{workPackage.mainResponsibility}</span>
      </div>}

      <div className="icon-navigation">
        <a className="navigation-item" onClick={toggleEditModal} aria-label={t("form.edit")} title={t("form.edit")}>
          <Icon name="pencil" size={18} />
        </a>
        <a className="navigation-item" onClick={() => { onDelete(currentPackage) }} aria-label={t("form.removeElement")} title={t("form.removeElement")}>
          <Icon name="trash" size={18} />
        </a>
      </div>
    </div>
    <WorkPackageModal
      header="form.project.workPackages.editPackage"
      modalOpen={editModalOpen}
      onSubmit={(values) => onEdit(currentPackage, values)}
      toggle={toggleEditModal}
      workPackage={workPackage}
    />
  </Card>
}

export default WorkPackageCard
