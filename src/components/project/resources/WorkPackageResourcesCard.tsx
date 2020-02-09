import React, { useState } from "react"
import { Button, Card, CardBody, Col, Row } from "reactstrap"

import { IProject, IProjectTask } from "api/schema"
import Icon from "components/common/Icon"
import TaskPopover from "components/project/common/TaskPopover"
import { useTranslation } from "services/i18n"
import { IPlanFunctions } from "../common/PlanContainer"
import PackageSumCard from "./PackageSumCard"
import TaskResourcesCard from "./TaskResourcesCard"

interface IProps {
  currentPackage: string
  functions: IPlanFunctions
  project: IProject
}

const WorkPackageResourcesCard: React.FC<IProps> = (props: IProps) => {
  const { t } = useTranslation()
  const [taskPopoverOpen, setTaskPopoverOpen] = useState(false)
  const toggleTaskPopover = () => setTaskPopoverOpen(!taskPopoverOpen)

  const { currentPackage, functions, project } = props

  const addTask = (values: IProjectTask) => {
    values.workPackage = currentPackage
    functions.addTask(values)
  }

  const workPackage = currentPackage ? functions.getWorkPackage(currentPackage) : null
  const tasks = functions.sortTasks(functions.getWorkPackageTasks(currentPackage))

  if (!currentPackage && tasks.length === 0) {
    return null
  }

  return <Card className="work-package-card">
    <CardBody>
      <Row className="show-grid">
        <Col lg={2} className="work-package-name">
          <Row className={"work-package-name-label"}><h5>{workPackage ? "Arbeitspaket" : "ohne Arbeitspaket"}</h5></Row>
          <Row className="work-package-name-content">{workPackage && workPackage.name}</Row>
        </Col>

        <Col lg={10} className="work-package-tasks">
          {tasks.map((task, i) => <TaskResourcesCard
            currentTask={task.id}
            functions={functions}
            isFirst={i === 0}
            key={task.id}
            project={project}
          />)}

          {currentPackage && <Row className={tasks.length > 0 ? "work-package-summary" : ""}>
            <Col lg={5} className={"work-package-add-task" + (tasks.length ? " has-tasks" : "")}>
              {t("form.project.tasks.addTask")}
              <Button
                aria-label={t("form.project.tasks.addTask")}
                className="btn btn-add btn-inline"
                color="link"
                id={"task-creation-form" + currentPackage}
                title={t("form.project.tasks.addTask")}
              >
                <Icon name="plus" size={24} />
              </Button>

              <TaskPopover
                header="form.project.tasks.addTask"
                onSubmit={addTask}
                popoverOpen={taskPopoverOpen}
                target={"task-creation-form" + currentPackage}
                toggle={toggleTaskPopover}
              />
            </Col>

            {tasks.length > 0 && <Col lg={7} className="work-package-cost-sum">
              <PackageSumCard
                currentPackage={currentPackage}
                functions={functions}
                project={project}
              />
            </Col>}
          </Row>}
        </Col>
      </Row>
    </CardBody>
  </Card >
}

export default WorkPackageResourcesCard