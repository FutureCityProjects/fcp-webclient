import React, { useState } from "react"
import { Card, CardBody, CardHeader, Collapse, UncontrolledTooltip } from "reactstrap"

import { IProject, IWorkPackage } from "api/schema"
import Icon from "components/common/Icon"
import { IPlanFunctions } from "components/project/common/PlanContainer"
import { useTranslation } from "services/i18n"
import TaskCard from "./TaskCard"
import WorkPackageModal from "./WorkPackageModal"

interface IProps {
  currentPackage: IWorkPackage
  functions: IPlanFunctions
  project: IProject
}

const WorkPackageCard: React.FC<IProps> = (props: IProps) => {
  const { t } = useTranslation()
  const { currentPackage, functions, project } = props

  const [isOpen, setIsOpen] = useState(true)
  const toggleCollapse = () => setIsOpen(!isOpen)

  const [editModalOpen, setEditModalOpen] = useState(false)
  const toggleEditModal = () => setEditModalOpen(!editModalOpen)

  const tasks = functions.getWorkPackageTasks(currentPackage.id)

  return <Card className="work-package-card">
    <CardHeader onClick={toggleCollapse}>
      <h4 id={"wp-" + currentPackage.id}>
        {t("project.workPackage.abbreviation") + currentPackage.order.toString() + ": " + currentPackage.name.substr(0, 23)}{currentPackage.name.length > 23 && "…"}
      </h4>
      {currentPackage.name.length > 23 && <UncontrolledTooltip target={"wp-" + currentPackage.id}>{currentPackage.name}</UncontrolledTooltip>}
      <Icon name="caret" size={28} />
    </CardHeader>

    <Collapse isOpen={isOpen}>
      <CardBody>
        {currentPackage.description &&
          <p className="work-package-description">{currentPackage.description}</p>}
        {tasks.length > 0
          ? tasks.map((task) => <TaskCard
            availablePackages={project.workPackages.filter((wp) => wp.id !== currentPackage.id)}
            key={task.id}
            onAssign={functions.updateTask}
            onDelete={functions.removeTask}
            task={task}
          />)
          : <p className="no-tasks">{t("page.projects.plan.workPackages.noTasks")}</p>
        }
      </CardBody>
    </Collapse>
    <div className="card-footer">
      <div className="task-count">
        <Icon name="to-do" size={18} />
        <span>{tasks.length}</span>
      </div>
      {currentPackage.mainResponsibility && <div>
        <Icon name="user" size={16} />
        <span>{currentPackage.mainResponsibility}</span>
      </div>}

      <div className="icon-navigation">
        <a className="navigation-item" onClick={toggleEditModal} aria-label={t("form.edit")} title={t("form.edit")}>
          <Icon name="pencil" size={18} />
        </a>
        <a
          aria-label={t("form.removeElement")}
          className="navigation-item"
          onClick={() => { functions.removeWorkPackage(currentPackage.id) }}
          title={t("form.removeElement")}
        >
          <Icon name="trash" size={18} />
        </a>
      </div>
    </div>

    <WorkPackageModal
      header="form.project.workPackages.editPackage"
      modalOpen={editModalOpen}
      onSubmit={(values) => functions.updateWorkPackage({ ...currentPackage, ...values })}
      toggle={toggleEditModal}
      workPackage={currentPackage}
    />
  </Card>
}

export default WorkPackageCard
