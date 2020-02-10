import React, { useState } from "react"
import { Button, Col, Row } from "reactstrap"

import { IProjectTask } from "api/schema"
import Icon from "components/common/Icon"
import { useTranslation } from "services/i18n"
import { IPlanFunctions } from "./PlanContainer"
import ResourceCard from "./ResourceCard"
import ResourceModal from "./ResourceModal"
import TaskSumCard from "./TaskSumCard"

interface IProps {
  currentTask: IProjectTask
  functions: IPlanFunctions
  isFirst: boolean
  showFinances: boolean
}

const TaskResourcesCard: React.FC<IProps> = (props: IProps) => {
  const { t } = useTranslation()
  const [resourceModalOpen, setResourceModalOpen] = useState(false)
  const toggleResourceModal = () => setResourceModalOpen(!resourceModalOpen)

  const { currentTask, functions, isFirst, showFinances = false } = props

  const addResource = (values) => {
    values.task = currentTask.id
    functions.addResourceRequirement(values)
  }

  const resourceRequirements = functions.sortResourceRequirements(functions.getTaskResourceRequirements(currentTask.id))

  return <Row className={"task-resources-card" + (isFirst ? "" : " not-first")}>
    <Col lg={showFinances ? 3 : 5} className="task-description">
      <Row className={"task-description-label d-lg-none d-xs-block"}><h5>{t("project.task.label")}</h5></Row>
      <Row className="task-description-content">{currentTask.description}</Row>
    </Col>

    <Col lg={showFinances ? 9 : 7} className="task-resources">

      {resourceRequirements.map((r, i) => <ResourceCard
        resourceRequirement={r}
        functions={functions}
        isFirst={i === 0}
        key={r.id}
        showFinances={showFinances}
      />)}

      <Row className="task-summary">
        <Col md={showFinances ? 5 : 8} className={"task-add-resource" + (resourceRequirements.length ? " has-resources" : "")}>
          {t("form.project.resourceRequirements.addResource")}
          <Button
            aria-label={t("form.project.resourceRequirements.addResource")}
            className="btn btn-add btn-inline"
            color="link"
            id="task-creation-form"
            onClick={(e) => { toggleResourceModal(); e.currentTarget.blur() }}
            title={t("form.project.resourceRequirements.addResource")}
          >
            <Icon name="plus" size={24} />
          </Button>

          <ResourceModal
            header="form.project.resourceRequirements.addResource"
            modalOpen={resourceModalOpen}
            onSubmit={addResource}
            toggle={toggleResourceModal}
            showFinances={showFinances}
          />
        </Col>
        {resourceRequirements.length > 1 && <TaskSumCard
          currentTask={currentTask}
          functions={functions}
          showFinances={showFinances}
        />}
      </Row>
    </Col>
  </Row>
}

export default TaskResourcesCard