import Link from "next/link"
import React from "react"
import { Card, CardBody, CardHeader, Col, Row } from "reactstrap"

import { IProject } from "api/schema"
import DropdownComponent from "components/common/DropdownComponent"
import ConfirmationForm from "components/common/form/ConfirmationForm"
import Icon from "components/common/Icon"
import { IPlanProps } from "components/project/common/PlanContainer"
import TotalSumCard from "components/project/common/TotalSumCard"
import WorkPackageResourcesCard from "components/project/common/WorkPackageResourcesCard"
import { useTranslation } from "services/i18n"
import { Routes, routeWithParams } from "services/routes"

const ProjectFinances: React.FC<IPlanProps> = (props: IPlanProps) => {
  const { t } = useTranslation()
  const { functions, project, updateProject } = props

  const packages = functions.sortWorkPackages(project.workPackages)

  return <Card className="body-card project-resources project-finances">
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
      <h4>{t("page.projects.plan.finances.fincancesHeading")} <Icon name="money-bag" size={24} /></h4>
      <span className="form-text">{t("page.projects.plan.finances.financesIntro")}</span>
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

      <div className="card-content">
        <Row>
          <Col lg={3}></Col>
          <Col lg={9}>
            <Row>
              <Col md={4}></Col>
              <Card className="work-package-card total-card">
                <CardBody>
                  <TotalSumCard
                    functions={functions}
                    showFinances={true}
                  />
                </CardBody>
              </Card>
            </Row>
          </Col>
        </Row>

        {packages.map((wp) => <WorkPackageResourcesCard
          currentPackage={wp}
          functions={functions}
          key={wp.id}
          showFinances={true}
        />)}

        <WorkPackageResourcesCard
          currentPackage={null}
          functions={functions}
          showFinances={true}
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

export default ProjectFinances