import { WithTranslation } from "next-i18next"
import React from "react"

import { IProject, ProjectProgress, SelfAssessment } from "api/schema"
import BaseLayout from "components/BaseLayout"
import IdeaCarousel from "components/marketplace/IdeaCarousel"
import ProjectCarousel from "components/marketplace/ProjectCarousel"
import { I18nPage, includeDefaultNamespaces, withTranslation } from "services/i18n"

type PageProps = WithTranslation

const MarketPage: I18nPage<PageProps> = () => {

  const i1: IProject = {
    id: 1,
    inspiration: null,
    progress: ProjectProgress.Idea,
    shortDescription: "was kurzes",
  }

  const i2: IProject = {
    id: 2,
    inspiration: null,
    progress: ProjectProgress.Idea,
    shortDescription: "Lorem ipsum dolor sit amet, consectetuer adipiscing elit. Aenean commodo ligula eget dolor. Aenean massa. Cum sociis natoque penatibus et magnis dis parturient montes, nascetur ridiculus mus. Donec quam felis, ultricies nec, pellentesque eu, pretium quis, sem. Nulla consequat mas",
  }

  const p1: IProject = {
    createdAt: new Date(),
    delimitation: "Wir grenzen uns von anderen Projekten ab durch ...",
    description: "etwas längere Beschreibung, kann HTML enthalten",
    goal: "Unser Ziel ist die Weltherrschaft",
    id: 10,
    inspiration: {
      id: 1,
      shortDescription: "die Inspiration",
    },
    name: "Testprojekt",
    profileSelfAssessment: SelfAssessment.MakingProgress,
    progress: ProjectProgress.CreatingPlan,
    shortDescription: "Lorem ipsum dolor sit amet, consectetuer adipiscing elit. Aenean commodo ligula eget dolor. Aenean massa. Cum sociis natoque penatibus et magnis dis parturient montes, nascetur ridiculus mus. Donec quam felis, ultricies nec, pellentesque eu, pretium quis, sem. Nulla consequat mas",
    slug: "testprojekt",
  }

  const p2: IProject = {
    createdAt: new Date(),
    delimitation: "Wir grenzen uns von anderen Projekten ab durch ...",
    description: "etwas längere Beschreibung, kann HTML enthalten",
    goal: "Unser Ziel ist die Weltherrschaft",
    id: 20,
    inspiration: {
      id: 2,
      shortDescription: "die andere Inspiration",
    },
    name: null,
    profileSelfAssessment: SelfAssessment.Starting,
    progress: ProjectProgress.CreatingPlan,
    shortDescription: "übernommen von der Projektidee",
    slug: null,
  }

  const ideas = [
    i1, i2,
  ]

  const projects = [
    p1, p2,
  ]

  return <BaseLayout pageTitle="Projektmarktplatz">
    <IdeaCarousel projects={ideas} />
    <ProjectCarousel projects={projects} />
  </BaseLayout>
}

MarketPage.getInitialProps = () => ({
  namespacesRequired: includeDefaultNamespaces(),
})

export default withTranslation(includeDefaultNamespaces())(MarketPage)
