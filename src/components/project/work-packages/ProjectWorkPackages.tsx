import Link from "next/link"
import React, { useState } from "react"
import { Button, Card, CardBody, CardHeader, Col, Row } from "reactstrap"

import { IProject } from "api/schema"
import DropdownComponent from "components/common/DropdownComponent"
import ConfirmationForm from "components/common/form/ConfirmationForm"
import Icon from "components/common/Icon"
import { IPlanProps } from "components/project/common/PlanContainer"
import TaskPopover from "components/project/common/TaskPopover"
import { useTranslation } from "services/i18n"
import { Routes, routeWithParams } from "services/routes"
import NoWorkPackages from "./NoWorkPackages"
import TaskCard from "./TaskCard"
import WordPackageCardContainer from "./WorkPackageCardContainer"
import WorkPackageModal from "./WorkPackageModal"

const ProjectWorkPackages: React.FC<IPlanProps> = ({ functions, project, updateProject }: IPlanProps) => {
  const { t } = useTranslation()

  const [packageModalOpen, setPackageModalOpen] = useState(false)
  const togglePackageModal = () => setPackageModalOpen(!packageModalOpen)

  const [taskPopoverOpen, setTaskPopoverOpen] = useState(false)
  const toggleTaskPopover = () => setTaskPopoverOpen(!taskPopoverOpen)

  const unassignedTasks = functions.getWorkPackageTasks(null)

  return <Card className="body-card project-tasks work-packages">
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
      <h4>{t("page.projects.plan.workPackages.packageHeading")} <Icon name="to-do" size={24} /></h4>
      <span className="form-text">{t("page.projects.plan.tasks.packageIntro")}</span>

      <div className="card-content">
        <div className="packages">
          {project.workPackages.length
            ? <WordPackageCardContainer
              functions={functions}
              project={project}
            />
            : <NoWorkPackages />
          }

          <Button
            aria-label={t("form.project.workPackages.addPackage")}
            className="btn-add"
            color="link"
            id="wp-creation-form"
            onClick={togglePackageModal}
            title={t("form.project.workPackages.addPackage")}
          >
            <Icon name="plus" size={24} />
          </Button>

          <WorkPackageModal
            header="form.project.workPackages.addPackage"
            modalOpen={packageModalOpen}
            onSubmit={functions.addWorkPackage}
            toggle={togglePackageModal}
          />
        </div>
        <div className="tasks">
          <Row xs={1} xl={2}>
            {unassignedTasks.map(task => <Col key={task.id}>
              <TaskCard
                availablePackages={project.workPackages}
                onAssign={functions.updateTask}
                onDelete={functions.removeTask}
                task={task}
              />
            </Col>)}
          </Row>

          <Row xs={1} xl={2}>
            <Col className="text-center">
              <Button
                aria-label={t("form.project.tasks.addTask")}
                className="btn-add"
                color="link"
                id="task-creation-form"
                title={t("form.project.tasks.addTask")}
              >
                <Icon name="plus" size={24} />
              </Button>

              <TaskPopover
                header="form.project.tasks.addTask"
                onSubmit={functions.addTask}
                popoverOpen={taskPopoverOpen}
                target="task-creation-form"
                toggle={toggleTaskPopover}
              />
            </Col>
          </Row>
        </div>
      </div>
      <div className="button-area">
        <ConfirmationForm
          buttonLabel="form.saveChanges"
          errorPrefix="project"
          onSubmit={(_values, actions) => {
            // only update the tasks, packages and resourceRequirements, we don't want to overwrite other data meanwhile updated
            const update: IProject = {
              "@id": project["@id"],
              resourceRequirements: project.resourceRequirements,
              tasks: project.tasks,
              workPackages: project.workPackages,
            }

            updateProject(update, actions)
          }}
        />
      </div>
    </CardBody>
  </Card>
}

export default ProjectWorkPackages
