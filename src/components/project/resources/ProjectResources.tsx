import Link from "next/link"
import React from "react"
import { Card, CardBody, CardHeader } from "reactstrap"

import { IProject } from "api/schema"
import DropdownComponent from "components/common/DropdownComponent"
import ConfirmationForm from "components/common/form/ConfirmationForm"
import Icon from "components/common/Icon"
import { IPlanProps } from "components/project/common/PlanContainer"
import { useTranslation } from "services/i18n"
import { Routes, routeWithParams } from "services/routes"
import WorkPackageResourcesCard from "./WorkPackageResourcesCard"

const ProjectResources: React.FC<IPlanProps> = (props: IPlanProps) => {
  const { t } = useTranslation()
  const { functions, project, updateProject } = props

  const packages = functions.sortWorkPackages(project.workPackages)

  return <Card className="body-card project-resources">
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
      <h3 className="card-title">{t("page.projects.plan.resourceRequirementsHeader")}</h3>
      <h4>{t("page.projects.plan.resourceRequirements.resourceHeading")} <Icon name="money-bag" size={24} /></h4>
      <span className="form-text">{t("page.projects.plan.resourceRequirements.resourceIntro")}</span>

      <div className="card-content">
        {packages.map((wp) => <WorkPackageResourcesCard
          currentPackage={wp.id}
          functions={functions}
          key={wp.id}
          project={project}
        />)}

        <WorkPackageResourcesCard
          currentPackage={null}
          functions={functions}
          project={project}
        />
      </div>

      <div className="button-area">
        <ConfirmationForm
          buttonLabel="form.saveChanges"
          errorPrefix="project"
          onSubmit={(_values, actions) => {
            // only update the plan, we don't want to overwrite other data meanwhile updated
            const updatedProject: IProject = {
              "@id": project["@id"],
              resourceRequirements: project.resourceRequirements,
              tasks: project.tasks,
              workPackages: project.workPackages,
            }

            updateProject(updatedProject, actions)
          }}
        />
      </div>
    </CardBody>
  </Card>
}

export default ProjectResources
