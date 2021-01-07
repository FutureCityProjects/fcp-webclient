import React from "react"
import Carousel from 'react-multi-carousel'

import { IProject } from "api/schema"
import EmptyIdeaCard from "./EmptyIdeaCard"
import IdeaCard from "./IdeaCard"

const responsive = {
  xl: {
    breakpoint: { max: 3000, min: 1800 },
    items: 4,
  },
  large: {
    breakpoint: { max: 1800, min: 1500 },
    items: 3,
  },
  medium: {
    breakpoint: { max: 1500, min: 1200 },
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

const IdeaCarousel: React.FC<IProps> = ({ projects }: IProps) => {
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

export default IdeaCarousel