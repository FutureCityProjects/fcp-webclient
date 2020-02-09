import React, { useState } from "react"
import { Button, Col, Row } from "reactstrap"

import { IProject } from "api/schema"
import Icon from "components/common/Icon"
import ResourceModal from "components/project/common/ResourceModal"
import { useTranslation } from "services/i18n"
import { IPlanFunctions } from "../common/PlanContainer"
import ResourceCard from "./ResourceCard"
import TaskSumCard from "./TaskSumCard"

interface IProps {
  currentTask: string
  functions: IPlanFunctions
  isFirst: boolean
  project: IProject
}

const TaskResourcesCard: React.FC<IProps> = (props: IProps) => {
  const { t } = useTranslation()
  const [resourceModalOpen, setResourceModalOpen] = useState(false)
  const toggleResourceModal = () => setResourceModalOpen(!resourceModalOpen)

  const { currentTask, functions, isFirst, project } = props

  const addResource = (values) => {
    values.task = currentTask
    functions.addResourceRequirement(values)
  }

  const task = functions.getTask(currentTask)
  const resourceRequirements = functions.sortResourceRequirements(functions.getTaskResourceRequirements(currentTask))

  return <Row className={"task-resources-card" + (isFirst ? "" : " not-first")}>
    <Col lg={5} className="task-description">
      <Row className={"task-description-label" + (isFirst ? "" : " d-lg-none")}><h5>Aufgabe</h5></Row>
      <Row className="task-description-content">{task.description}</Row>
    </Col>

    <Col lg={7} className="task-resources">

      {resourceRequirements.length === 0 && isFirst && // just an empty spacer for alignment on big screens
        <Row className="task-empty-resources-header d-lg-block"></Row>}

      {resourceRequirements.map((r, i) => <ResourceCard
        currentResource={r.id}
        functions={functions}
        isFirst={i === 0}
        key={r.id}
        project={project}
      />)}

      {resourceRequirements.length > 1 && <TaskSumCard
        currentTask={task.id}
        functions={functions}
        project={project}
      />}

      <Row>
        <Col md={12} className={"task-add-resource" + (resourceRequirements.length ? " has-resources" : "")}>
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
          />
        </Col>
      </Row>
    </Col>
  </Row>
}

export default TaskResourcesCard