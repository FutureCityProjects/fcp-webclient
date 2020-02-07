import Link from "next/link"
import React, { useState } from "react"
import { Button, Card, CardBody, CardHeader, Col, Row } from "reactstrap"
import uuidv1 from "uuid/v1"

import { IProject, IProjectTask, IWorkPackage } from "api/schema"
import DropdownComponent from "components/common/DropdownComponent"
import ConfirmationForm from "components/common/form/ConfirmationForm"
import Icon from "components/common/Icon"
import { useTranslation } from "services/i18n"
import { Routes, routeWithParams } from "services/routes"
import NoWorkPackages from "./NoWorkPackages"
import TaskCard from "./TaskCard"
import TaskPopover from "./TaskPopover"
import WordPackageCardContainer from "./WorkPackageCardContainer"
import WorkPackageModal from "./WorkPackageModal"

interface IProps {
  onSubmit: any
  project: IProject
}

const ProjectWorkPackages: React.FC<IProps> = (props: IProps) => {
  const { t } = useTranslation()

  const [project, setProject] = useState(props.project)

  const [packageModalOpen, setPackageModalOpen] = useState(false)
  const togglePackageModal = () => setPackageModalOpen(!packageModalOpen)

  const [taskPopoverOpen, setTaskPopoverOpen] = useState(false)
  const toggleTaskPopover = () => setTaskPopoverOpen(!taskPopoverOpen)

  const addWorkPackage = (workPackage: IWorkPackage) => {
    workPackage.id = uuidv1()
    workPackage.order = project.workPackages.length + 1

    project.workPackages.push(workPackage)
    setProject(project)
  }

  const assignPackage = (taskId: string, workPackageId: string) => {
    const updatedTasks = project.tasks.map((task) => task.id === taskId
      ? { ...task, workPackage: workPackageId }
      : task
    )

    setProject({ ...project, tasks: updatedTasks })
  }

  const createTask = (task: IProjectTask) => {
    task.id = uuidv1()
    project.tasks.push(task)
    setProject(project)
    toggleTaskPopover()
  }

  const deleteTask = (taskId: string) => {
    setProject({ ...project, tasks: project.tasks.filter((task) => task.id !== taskId) })
  }

  const deleteWorkPackage = (id: string) => {
    const updatedTasks = project.tasks.map((task) => task.workPackage === id
      ? { ...task, workPackage: null }
      : task
    )

    const updatedPackages = project.workPackages.filter((wp) => wp.id !== id)

    setProject({ ...project, tasks: updatedTasks, workPackages: updatedPackages })
  }

  const editWorkPackage = (id: string, values: object) => {
    const updatedPackages = project.workPackages.map((wp) => wp.id === id
      ? { ...wp, ...values }
      : wp
    )

    setProject({ ...project, workPackages: updatedPackages })
  }

  const unassignedTasks = project.tasks.map((task) => !task.workPackage &&
    <Col key={task.id}>
      <TaskCard
        availablePackages={project.workPackages}
        onAssign={assignPackage}
        onDelete={deleteTask}
        task={task}
      />
    </Col>
  )

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
              onEdit={editWorkPackage}
              onDelete={deleteWorkPackage}
              onTaskAssign={assignPackage}
              onTaskDelete={deleteTask}
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
            onSubmit={addWorkPackage}
            toggle={togglePackageModal}
          />
        </div>
        <div className="tasks">
          <Row xs={1} xl={2}>
            {unassignedTasks}
          </Row>

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
            onSubmit={createTask}
            popoverOpen={taskPopoverOpen}
            target="task-creation-form"
            toggle={toggleTaskPopover}
          />
        </div>
      </div>
      <div className="button-area">
        <ConfirmationForm
          buttonLabel="form.saveChanges"
          errorPrefix="project"
          onSubmit={(_values, actions) => {
            // only update the tasks & packages, we don't want to overwrite other data meanwhile updated
            const packageUpdate: IProject = {
              "@id": project["@id"],
              tasks: project.tasks,
              workPackages: project.workPackages,
            }

            props.onSubmit(packageUpdate, actions)
          }}
        />
      </div>
    </CardBody>
  </Card>
}

export default ProjectWorkPackages
