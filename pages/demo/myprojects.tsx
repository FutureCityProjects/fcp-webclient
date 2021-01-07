/* eslint-disable no-console */
import { WithTranslation } from "next-i18next"
import React from "react"

import { IProject, IProjectMembership, MembershipRole, ProjectProgress, SelfAssessment } from "api/schema"
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
    profileSelfAssessment: SelfAssessment.MakingProgress,
    progress: ProjectProgress.CreatingPlan,
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
    profileSelfAssessment: SelfAssessment.Starting,
    progress: ProjectProgress.CreatingPlan,
    shortDescription: "übernommen von der Projektidee",
    slug: null,
  }

  const membership: IProjectMembership = {
    role: MembershipRole.Member,
  }

  return (
    <BaseLayout pageTitle="Meine Projekte">
      <MyProjectCard project={p1} deleteMembership={(m) => console.log(m)} membership={membership} />
      <MyProjectCard project={p2} deleteMembership={(m) => console.log(m)} membership={membership} />
    </BaseLayout>
  )

}

MyProjectsPage.getInitialProps = () => ({
  namespacesRequired: includeDefaultNamespaces(),
})

export default withTranslation(includeDefaultNamespaces())(MyProjectsPage)
