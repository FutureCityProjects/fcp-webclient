import React from "react"

import { IProject } from "api/schema"
import EmptyProjectCard from "./EmptyProjectCard"
import ProjectCard from "./ProjectCard"

interface IProps {
  projects: IProject[]
}

export default class ProjectCarousel extends React.Component<IProps> {
  public render() {
    const projects = this.props.projects

    const wrappedProjects = projects.map((project) => {
      return (
        <li key={project.id}>
          <ProjectCard project={project} />
        </li>
      )
    })

    return <div className="project-carousel-content full-width">
      <ul className="">
        {/* @todo randomly insert EmptyProjectCard in list? */}
        {wrappedProjects}
        <li>
          <EmptyProjectCard></EmptyProjectCard>
        </li>
      </ul>
    </div>
  }
}
