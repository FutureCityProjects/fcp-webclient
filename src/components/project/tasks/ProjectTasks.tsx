import Link from "next/link"
import React, { useState } from "react"
import { Card, CardBody, CardHeader, Col, Row } from "reactstrap"
import uuidv1 from "uuid/v1"

import { IProject } from "api/schema"
import DropdownComponent from "components/common/DropdownComponent"
import ConfirmationForm from "components/common/form/ConfirmationForm"
import Icon from "components/common/Icon"
import { useTranslation } from "services/i18n"
import { Routes, routeWithParams } from "services/routes"
import EmptyProjectTaskCard from "./EmptyProjectTaskCard"
import ProjectTaskCardGrid from "./ProjectTaskCardGrid"

interface IProps {
  onSubmit: any
  project: IProject
}

const ProjectTasks: React.FC<IProps> = ({ onSubmit, project }: IProps) => {
  const { t } = useTranslation()
  const [tasks, setTasks] = useState(project.tasks || [])

  const addTask = (description: string) => {
    setTasks([{ description, id: uuidv1() }, ...tasks])
  }

  const deleteTask = (id: string) => {
    setTasks(tasks.filter((task) => task.id !== id))
  }

  const updateTask = (id: string, description: string) => {
    const updatedTasks = tasks.map((task) => task.id === id
      ? { ...task, description }
      : task
    )
    setTasks(updatedTasks)
  }

  return <Card className="body-card project-tasks">
    <CardHeader>
      <div className="title-section">
        <h3>{project.name}</h3>
        <span>
          {t("page.projects.index.project.subHeader", // @todo eigene Übersetzung oder key verallgemeinern
            {
              date: project.createdAt,
              user: project.createdBy ? project.createdBy.username : t("user.unknown"),
            })}
        </span>
      </div>
      <DropdownComponent button={<Icon name="grid" size={26} />}>
        <Link
          href={Routes.PROJECT_PLAN}
          as={routeWithParams(Routes.PROJECT_PLAN, { slug: project.slug || project.id })}
        >
          <a>{t("goto.planOverview")}</a>
        </Link>
        <Link href={Routes.MY_PROJECTS} as={Routes.MY_PROJECTS + "#project-" + project.id}>
          <a>{t("goto.myProjects")}</a>
        </Link>
      </DropdownComponent>
    </CardHeader>
    <CardBody>
      <h3 className="card-title">{t("page.projects.plan.workHeader")}</h3>
      <h4>{t("page.projects.plan.tasks.taskHeading")} <Icon name="to-do" size={24} /></h4>
      <span className="form-text">{t("page.projects.plan.tasks.taskIntro")}</span>

      <Row>
        <Col lg={4}><EmptyProjectTaskCard onSubmit={addTask} /></Col>
      </Row>

      <ProjectTaskCardGrid tasks={tasks} onDelete={deleteTask} onUpdate={updateTask} />

      <div className="button-area">
        <ConfirmationForm
          buttonLabel="form.saveChanges"
          onSubmit={(_values, actions) => {
            // only update the tasks, we don't want to overwrite other data meanwhile updated
            const taskUpdate: IProject = {
              "@id": project["@id"],
              tasks
            }

            onSubmit(taskUpdate, actions)
          }}
        />
      </div>
    </CardBody>
  </Card>
}

export default ProjectTasks
