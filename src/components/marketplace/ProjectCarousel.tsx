import React from "react"
import Carousel from 'react-multi-carousel'

import { IProject } from "api/schema"
import EmptyProjectCard from "./EmptyProjectCard"
import ProjectCard from "./ProjectCard"

const responsive = {
  large: {
    breakpoint: { max: 4000, min: 2000 },
    items: 3,
  },
  medium: {
    breakpoint: { max: 2000, min: 1300 },
    items: 2,
  },
  small: {
    breakpoint: { max: 1300, min: 0 },
    items: 1,
  },
}

interface IProps {
  projects: IProject[]
}

const ProjectCarousel: React.FC<IProps> = ({ projects }: IProps) => {
  const wrappedProjects = projects.map((project) => <ProjectCard key={project.id} project={project} />)

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
    <EmptyProjectCard />
  </Carousel>
}

export default ProjectCarousel