import React from "react"

import { FundApplicationState, IProject, ProjectProgress } from "api/schema"
import { Routes, routeWithParams } from "services/routes"
import ProgressBox from "./ProgressBox"

interface IProps {
  project: IProject
}

const SubmissionBox: React.FC<IProps> = ({ project }: IProps) => {
  // @todo support multiple applications, how to store which one is the active application?
  const application = project.applications && project.applications.length && project.applications[0]

  if (!application) {
    return <ProgressBox
      icon="message"
      title="project.tableau.submitApplication"
      subtitle="project.tableau.fundApplication"
      active={false}
    />
  }

  // if the current application is submitted always allow to view the submission,
  // regardless of the projects progress
  if (application.state === FundApplicationState.Submitted) {
    return <ProgressBox
      icon="message"
      title="project.tableau.submitApplication"
      subtitle="project.tableau.fundApplication"
      progress={100}
      complete={true}
      active={true}
      // @todo link via application ID
      href={{
        pathname: Routes.ProjectFundApplicationSubmission,
        query: { fund: application.fund.id }
      }}
      as={{
        pathname: routeWithParams(Routes.ProjectFundApplicationSubmission, { slug: project.slug || project.id }),
        query: { fund: application.fund.id }
      }}
    />
  }

  // not clickable if function not available
  if (project.progress !== ProjectProgress.SubmittingApplication
  ) {
    return <ProgressBox
      icon="message"
      title="project.tableau.submitApplication"
      subtitle="project.tableau.fundApplication"
      active={false}
    />
  }

  return <ProgressBox
    icon="message"
    title="project.tableau.submitApplication"
    subtitle="project.tableau.fundApplication"
    progress={null}
    complete={false}
    active={true}
    // @todo link via application ID
    href={{
      pathname: Routes.ProjectFundApplicationSubmit,
      query: { fund: application.fund.id }
    }}
    as={{
      pathname: routeWithParams(Routes.ProjectFundApplicationSubmit, { slug: project.slug || project.id }),
      query: { fund: application.fund.id }
    }}
  />
}

export default SubmissionBox