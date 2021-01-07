import Link from "next/link"
import React from "react"
import { Card, CardBody, CardHeader, Col, Row } from "reactstrap"

import { IProject } from "api/schema"
import DropdownComponent from "components/common/DropdownComponent"
import ConfirmationForm from "components/common/form/ConfirmationForm"
import Icon from "components/common/Icon"
import TranslatedHtml from "components/common/TranslatedHtml"
import { IPlanProps } from "components/project/common/PlanContainer"
import { useTranslation } from "services/i18n"
import { Routes, routeWithParams } from "services/routes"
import EmptyProjectTaskCard from "./EmptyProjectTaskCard"
import ProjectTaskCardGrid from "./ProjectTaskCardGrid"

const ProjectTasks: React.FC<IPlanProps> = ({ functions, project, updateProject }: IPlanProps) => {
  const { t } = useTranslation()

  const tasks = functions.getTasks()

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
          href={Routes.projectPlan}
          as={routeWithParams(Routes.projectPlan, { slug: project.slug || project.id })}
        >
          <a>{t("goto.planOverview")}</a>
        </Link>
        <Link href={Routes.myProjects} as={Routes.myProjects + "#project-" + project.id}>
          <a>{t("goto.myProjects")}</a>
        </Link>
      </DropdownComponent>
    </CardHeader>
    <CardBody>
      <h3 className="card-title">{t("page.projects.plan.workHeader")}</h3>
      <h4>{t("page.projects.plan.tasks.taskHeading")} <Icon name="to-do" size={24} /></h4>
      <span className="form-text"><TranslatedHtml content="page.projects.plan.tasks.taskIntro" /></span>

      <div className="button-area">
        <ConfirmationForm
          buttonLabel="form.saveChanges"
          onSubmit={(_values, actions) => {
            // only update the tasks/resourceRequirements, we don't want to overwrite other data meanwhile updated
            const update: IProject = {
              "@id": project["@id"],
              resourceRequirements: project.resourceRequirements,
              tasks: project.tasks,
            }

            updateProject(update, actions)
          }}
        />
      </div>

      <Row>
        <Col lg={8}>
          <EmptyProjectTaskCard onSubmit={functions.addTask} />
        </Col>
      </Row>

      <ProjectTaskCardGrid
        tasks={tasks}
        onDelete={functions.removeTask}
        onUpdate={functions.updateTask}
      />

      <div className="button-area">
        <ConfirmationForm
          buttonLabel="form.saveChanges"
          onSubmit={(_values, actions) => {
            // only update the tasks/resourceRequirements, we don't want to overwrite other data meanwhile updated
            const update: IProject = {
              "@id": project["@id"],
              resourceRequirements: project.resourceRequirements,
              tasks: project.tasks,
            }

            updateProject(update, actions)
          }}
        />
      </div>
    </CardBody>
  </Card>
}

export default ProjectTasks
