import React, { useState } from "react"
import { Button, Card, CardBody, CardHeader, Col, Row } from "reactstrap"

import { IProjectTask, IWorkPackage } from "api/schema"
import Icon from "components/common/Icon"
import { useTranslation } from "services/i18n"
import PackageSumCard from "./PackageSumCard"
import { IPlanFunctions } from "./PlanContainer"
import TaskPopover from "./TaskPopover"
import TaskResourcesCard from "./TaskResourcesCard"

interface IProps {
  currentPackage: IWorkPackage
  functions: IPlanFunctions
  showFinances?: boolean
}

const WorkPackageResourcesCard: React.FC<IProps> = (props: IProps) => {
  const { t } = useTranslation()
  const [taskPopoverOpen, setTaskPopoverOpen] = useState(false)
  const toggleTaskPopover = () => setTaskPopoverOpen(!taskPopoverOpen)

  const { currentPackage, functions, showFinances = false } = props

  const addTask = (values: IProjectTask) => {
    values.workPackage = currentPackage.id
    functions.addTask(values)
  }

  const tasks = functions.sortTasks(functions.getWorkPackageTasks(currentPackage ? currentPackage.id : null))

  if (!currentPackage && tasks.length === 0) {
    return null
  }

  return <Card className="work-package-card">
    <CardHeader>
      {t(currentPackage ? "project.workPackage.label" : "project.workPackage.noPackage")}{currentPackage && (": " + currentPackage.name)}
    </CardHeader>
    <CardBody>
      {tasks.length > 0 && <Row className="package-table-header d-none d-lg-flex">
        <Col className="th" lg={showFinances ? 3 : 5}>
          <h5>{t("project.task.label")}</h5>
        </Col>
        <Col lg={showFinances ? 9 : 7}>
          <Row>
            <Col className="th" md={showFinances ? 5 : 8}  >
              <h5>{t("project.resourceRequirement.label")}</h5>
            </Col>
            {showFinances && <Col className="th" md={4}>
              <h5>{t("project.resourceRequirement.source")}</h5>
            </Col>}
            <Col className="th text-right" md={showFinances ? 3 : 4} >
              <h5>{t("project.resourceRequirement.cost")}</h5>
            </Col>
          </Row>
        </Col>
      </Row>}

      {tasks.map((task, i) => <TaskResourcesCard
        currentTask={task}
        functions={functions}
        isFirst={i === 0}
        key={task.id}
        showFinances={showFinances}
      />)}

      {currentPackage && <Row className={tasks.length > 0 ? "work-package-summary" : ""}>
        <Col lg={showFinances ? 3 : 5} className={"work-package-add-task" + (tasks.length ? " has-tasks" : "")}>
          {t("form.project.tasks.addTask")}
          <Button
            aria-label={t("form.project.tasks.addTask")}
            className="btn btn-add btn-inline"
            color="link"
            id={"task-creation-form" + currentPackage.id}
            title={t("form.project.tasks.addTask")}
          >
            <Icon name="plus" size={24} />
          </Button>

          <TaskPopover
            header="form.project.tasks.addTask"
            onSubmit={addTask}
            popoverOpen={taskPopoverOpen}
            target={"task-creation-form" + currentPackage.id}
            toggle={toggleTaskPopover}
          />
        </Col>

        {tasks.length > 0 && <Col lg={showFinances ? 9 : 7} className="work-package-cost-sum">
          <PackageSumCard
            currentPackage={currentPackage}
            functions={functions}
            showFinances={showFinances}
          />
        </Col>}
      </Row>}
    </CardBody>
  </Card >
}

export default WorkPackageResourcesCard