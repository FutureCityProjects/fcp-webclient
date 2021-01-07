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
        complete={project.profileSelfAssessment === SelfAssessment.COMPLETE}
        icon="document"
        title="project.tableau.profile"
        subtitle="project.tableau.project"
        href={Routes.projectProfile}
        as={routeWithParams(Routes.projectProfile, { slug: project.slug || project.id })}
        progress={project.name ? project.profileSelfAssessment : null}
      />

      {!project.applications || project.applications.length === 0
        ? <ProgressBox
          icon="pot"
          title="project.tableau.selectFund"
          subtitle="project.tableau.fund"
          active={project.progress !== ProjectProgress.CREATING_PROFILE}
          href={project.progress === ProjectProgress.CREATING_PROFILE ? null : Routes.projectSelectFund}
          as={project.progress === ProjectProgress.CREATING_PROFILE ? null : routeWithParams(Routes.projectSelectFund, { slug: project.slug || project.id })}
        />
        : <ProgressBox
          icon="pot"
          title="project.tableau.concretization"
          subtitle="project.tableau.fund"
          active={project.progress !== ProjectProgress.CREATING_PROFILE}
          // @todo support multiple applications, how to store which one is the active application?
          complete={project.progress !== ProjectProgress.CREATING_PROFILE && project.applications[0].concretizationSelfAssessment === SelfAssessment.COMPLETE}
          href={project.progress === ProjectProgress.CREATING_PROFILE ? null : {
            pathname: Routes.projectConcretization,
            // @todo support multiple applications, how to store which one is the active application?
            query: { fund: project.applications[0].fund.id }
          }}
          as={project.progress === ProjectProgress.CREATING_PROFILE ? null : {
            pathname: routeWithParams(Routes.projectConcretization, { slug: project.slug || project.id }),
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
        complete={project.progress !== ProjectProgress.CREATING_PROFILE && project.planSelfAssessment === SelfAssessment.COMPLETE}
        active={project.progress !== ProjectProgress.CREATING_PROFILE}
        progress={project.planSelfAssessment}
        href={project.progress !== ProjectProgress.CREATING_PROFILE ? Routes.projectPlan : null}
        as={project.progress !== ProjectProgress.CREATING_PROFILE ? routeWithParams(Routes.projectPlan, { slug: project.slug || project.id }) : null}
      />

      {project.progress === ProjectProgress.CREATING_PROFILE
        || project.progress === ProjectProgress.CREATING_PLAN
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
          complete={project.applications[0].applicationSelfAssessment === SelfAssessment.COMPLETE}
          progress={project.applications[0].applicationSelfAssessment}
          href={{
            pathname: Routes.projectFundApplication,
            // @todo support multiple applications, how to store which one is the active application?
            query: { fund: project.applications[0].fund.id }
          }}
          as={{
            pathname: routeWithParams(Routes.projectFundApplication, { slug: project.slug || project.id }),
            // @todo support multiple applications, how to store which one is the active application?
            query: { fund: project.applications[0].fund.id }
          }}
        />
      }

      <SubmissionBox project={project} />
    </div>

    <div className="sub-step-container">
      <ProgressSubBox href={Routes.offlineToolTeam} title={t("project.tableau.teamTool")} />
      <ProgressSubBox href={Routes.offlineToolProfile} title={t("project.tableau.profileTool")} />
      <ProgressSubBox href={Routes.offlineToolPlanning} title={t("project.tableau.planTool")} />
    </div>
  </>
}

export default ProjectStatus