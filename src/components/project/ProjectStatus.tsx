import React from "react"

import { IProject, ProjectProgress, SelfAssessment } from "api/schema"
import { useTranslation } from "services/i18n"
import { Routes, routeWithParams } from "services/routes"
import ProgressActionIcons from "./status/ProgressActionIcons"
import ProgressBox from "./status/ProgressBox"
import ProgressSubBox from "./status/ProgressSubBox"
import SubmissionBox from "./status/SubmissionBox"

interface IProps {
  project: IProject
}

const ProjectStatus: React.FC<IProps> = (props: IProps) => {
  const { t } = useTranslation()
  const project = props.project

  return <>
    <ProgressActionIcons project={project} />
    <div className="step-container">
      <ProgressBox
        complete={true}
        icon="light-bulb"
        title="project.tableau.idea"
        subtitle="project.tableau.project"
        progress={100}
      />

      <ProgressBox
        complete={project.profileSelfAssessment === SelfAssessment.Complete}
        icon="document"
        title="project.tableau.profile"
        subtitle="project.tableau.project"
        href={Routes.ProjectProfile}
        as={routeWithParams(Routes.ProjectProfile, { slug: project.slug || project.id })}
        progress={project.name ? project.profileSelfAssessment : null}
      />

      {!project.applications || project.applications.length === 0
        ? <ProgressBox
          icon="pot"
          title="project.tableau.selectFund"
          subtitle="project.tableau.fund"
          active={project.progress !== ProjectProgress.CreatingProfile}
          href={project.progress === ProjectProgress.CreatingProfile ? null : Routes.ProjectSelectFund}
          as={project.progress === ProjectProgress.CreatingProfile ? null : routeWithParams(Routes.ProjectSelectFund, { slug: project.slug || project.id })}
        />
        : <ProgressBox
          icon="pot"
          title="project.tableau.concretization"
          subtitle="project.tableau.fund"
          active={project.progress !== ProjectProgress.CreatingProfile}
          // @todo support multiple applications, how to store which one is the active application?
          complete={project.progress !== ProjectProgress.CreatingProfile && project.applications[0].concretizationSelfAssessment === SelfAssessment.Complete}
          href={project.progress === ProjectProgress.CreatingProfile ? null : {
            pathname: Routes.ProjectConcretization,
            // @todo support multiple applications, how to store which one is the active application?
            query: { fund: project.applications[0].fund.id }
          }}
          as={project.progress === ProjectProgress.CreatingProfile ? null : {
            pathname: routeWithParams(Routes.ProjectConcretization, { slug: project.slug || project.id }),
            // @todo support multiple applications, how to store which one is the active application?
            query: { fund: project.applications[0].fund.id }
          }}
          progress={project.applications[0].concretizationSelfAssessment}
        />
      }

      <ProgressBox
        icon="compasses"
        title="project.tableau.plan"
        subtitle="project.tableau.project"
        complete={project.progress !== ProjectProgress.CreatingProfile && project.planSelfAssessment === SelfAssessment.Complete}
        active={project.progress !== ProjectProgress.CreatingProfile}
        progress={project.planSelfAssessment}
        href={project.progress !== ProjectProgress.CreatingProfile ? Routes.ProjectPlan : null}
        as={project.progress !== ProjectProgress.CreatingProfile ? routeWithParams(Routes.ProjectPlan, { slug: project.slug || project.id }) : null}
      />

      {project.progress === ProjectProgress.CreatingProfile
        || project.progress === ProjectProgress.CreatingPlan
        || !project.applications
        ? <ProgressBox
          icon="money-bag"
          title="project.tableau.application"
          subtitle="project.tableau.funding"
          // @todo support multiple applications, how to store which one is the active application?
          progress={project.applications && project.applications.length ? project.applications[0].applicationSelfAssessment : null}
          complete={false}
          active={false}
        />
        : <ProgressBox
          active={true}
          icon="money-bag"
          title="project.tableau.application"
          subtitle="project.tableau.funding"
          // @todo support multiple applications, how to store which one is the active application?
          complete={project.applications[0].applicationSelfAssessment === SelfAssessment.Complete}
          progress={project.applications[0].applicationSelfAssessment}
          href={{
            pathname: Routes.ProjectFundApplication,
            // @todo support multiple applications, how to store which one is the active application?
            query: { fund: project.applications[0].fund.id }
          }}
          as={{
            pathname: routeWithParams(Routes.ProjectFundApplication, { slug: project.slug || project.id }),
            // @todo support multiple applications, how to store which one is the active application?
            query: { fund: project.applications[0].fund.id }
          }}
        />
      }

      <SubmissionBox project={project} />
    </div>

    <div className="sub-step-container">
      <ProgressSubBox href={Routes.OfflineToolTeam} title={t("project.tableau.teamTool")} />
      <ProgressSubBox href={Routes.OfflineToolProfile} title={t("project.tableau.profileTool")} />
      <ProgressSubBox href={Routes.OfflineToolPlanning} title={t("project.tableau.planTool")} />
    </div>
  </>
}

export default ProjectStatus