import React from "react"
import { Col, Row } from "reactstrap"

import { IProjectTask } from "api/schema"
import ProjectTaskCard from "./ProjectTaskCard"

interface IProps {
  onDelete: any
  onUpdate: any
  tasks: IProjectTask[]
}

const ProjectTaskCardGrid: React.FC<IProps> = ({ tasks, onDelete, onUpdate }: IProps) => {
  const wrappedTasks = tasks.map((task) =>
    <Col key={task.id} lg={4} md={6}>
      <ProjectTaskCard onDelete={onDelete} onUpdate={onUpdate} task={task} />
    </Col>
  )

  return <Row className="task-card-grid">
    {wrappedTasks}
  </Row>
}

export default ProjectTaskCardGrid
