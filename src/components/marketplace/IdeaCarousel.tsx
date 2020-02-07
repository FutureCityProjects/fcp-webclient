import React from "react"
import Carousel from 'react-multi-carousel'

import { IProject } from "api/schema"
import EmptyIdeaCard from "./EmptyIdeaCard"
import IdeaCard from "./IdeaCard"

const responsive = {
  large: {
    breakpoint: { max: 2400, min: 1800 },
    items: 3,
  },
  medium: {
    breakpoint: { max: 1800, min: 1200 },
    items: 2,
  },
  small: {
    breakpoint: { max: 1200, min: 0 },
    items: 1,
  },
}

interface IProps {
  projects: IProject[]
}

export default class IdeaCarousel extends React.Component<IProps> {
  public render() {
    const projects = this.props.projects

    const wrappedProjects = projects.map((project) => <IdeaCard key={project.id} project={project} />)

    return <Carousel
      autoPlay={true}
      autoPlaySpeed={5000}
      centerMode
      draggable={true}
      infinite={true}
      keyBoardControl={true}
      renderButtonGroupOutside={true}
      responsive={responsive}
      ssr={true}
      swipeable={true}
    >
      {wrappedProjects}
      <EmptyIdeaCard />
    </Carousel >
  }
}
