import React from "react"

import { IProject, ProjectProgress } from "api/schema"
import { Routes, routeWithParams } from "services/routes"
import ProgressActionIcons from "./status/ProgressActionIcons"
import ProgressBox from "./status/ProgressBox"
import ProgressSubBox from "./status/ProgressSubBox"

interface IProps {
  project: IProject
}

export default class ProjectStatus extends React.Component<IProps> {
  public render() {
    const project = this.props.project

    return <>
      <ProgressActionIcons />
      <div className="step-container">
        <ProgressBox
          icon="light-bulb"
          title="project.tableau.idea"
          subtitle="project.tableau.project"
          progress={100}
        />

        <ProgressBox
          icon="document"
          title="project.tableau.profile"
          subtitle="project.tableau.project"
          href={Routes.PROJECT_PROFILE}
          as={routeWithParams(Routes.PROJECT_PROFILE, { slug: project.slug || project.id })}
          progress={project.name ? project.profileSelfAssessment : null}
        />

        {project.progress === ProjectProgress.CREATING_PROFILE
          ? <ProgressBox
            icon="pot"
            title="project.tableau.selectFund"
            subtitle="project.tableau.fund"
            active={false}
          />
          : <ProgressBox
            icon="pot"
            title="project.tableau.selectFund"
            subtitle="project.tableau.fund"
            active={true}
            href={Routes.PROJECT_SELECT_FUND}
            as={routeWithParams(Routes.PROJECT_SELECT_FUND, { slug: project.slug || project.id })}
          />
        }

        <ProgressBox
          icon="compasses"
          title="project.tableau.plan"
          subtitle="project.tableau.project"
          active={project.progress !== ProjectProgress.CREATING_PROFILE}
          href={project.progress !== ProjectProgress.CREATING_PROFILE ? Routes.PROJECT_PROFILE : null}
        />

        <ProgressBox
          icon="money-bag"
          title="project.tableau.application"
          subtitle="project.tableau.fund"
          active={false}
        />

        <ProgressBox
          icon="message"
          title="project.tableau.submitApplication"
          subtitle="project.tableau.fund"
          active={false}
        />
      </div>

      <div className="sub-step-container">
        <ProgressSubBox boxType="start" text="team" />
        <ProgressSubBox text="profil" />
        <ProgressSubBox boxType="end" text="planung" />
      </div>
    </>
  }
}
