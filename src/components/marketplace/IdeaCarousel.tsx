import React from "react"

import { IProject } from "api/schema"
import EmptyIdeaCard from "./EmptyIdeaCard"
import IdeaCard from "./IdeaCard"

interface IProps {
  projects: IProject[]
}

export default class IdeaCarousel extends React.Component<IProps> {
  public render() {
    const projects = this.props.projects

    const wrappedProjects = projects.map((project) => {
      return (
        <li key={project.id}>
          <IdeaCard project={project} />
        </li>
      )
    })

    return <div className="project-carousel-content full-width">
      <ul className="fullscreen overflow-scroll">
        {/* @todo randomly insert EmptyIdeaCard in list? */}
        {wrappedProjects}
        <li>
          <EmptyIdeaCard />
        </li>
      </ul>
    </div>
  }
}
