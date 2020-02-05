import { WithTranslation } from "next-i18next"
import React from "react"

import { IProject, ProjectProgress, SelfAssessment } from "api/schema"
import BaseLayout from "components/BaseLayout"
import MyProjectCard from "components/project/MyProjectCard"

import { I18nPage, includeDefaultNamespaces, withTranslation } from "services/i18n"

type PageProps = WithTranslation

const MyProjectsPage: I18nPage<PageProps> = () => {
  const p1: IProject = {
    applications: [],
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
    profileSelfAssessment: SelfAssessment.MAKING_PROGRESS,
    progress: ProjectProgress.CREATING_PLAN,
    shortDescription: "Lorem ipsum dolor sit amet, consectetuer adipiscing elit. Aenean commodo ligula eget dolor. Aenean massa. Cum sociis natoque penatibus et magnis dis parturient montes, nascetur ridiculus mus. Donec quam felis, ultricies nec, pellentesque eu, pretium quis, sem. Nulla consequat mas",
    slug: "testprojekt",
  }

  const p2: IProject = {
    applications: [],
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
    profileSelfAssessment: SelfAssessment.STARTING,
    progress: ProjectProgress.CREATING_PLAN,
    shortDescription: "übernommen von der Projektidee",
    slug: null,
  }

  return (
    <BaseLayout pageTitle="Meine Projekte">
      <MyProjectCard project={p1} />
      <MyProjectCard project={p2} />
    </BaseLayout>
  )

}

MyProjectsPage.getInitialProps = async () => ({
  namespacesRequired: includeDefaultNamespaces(),
})

export default withTranslation(includeDefaultNamespaces())(MyProjectsPage)
