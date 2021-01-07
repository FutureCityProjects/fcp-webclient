/* eslint-disable no-console */
import { WithTranslation } from "next-i18next"
import React from "react"

import { IProject, ProjectProgress, SelfAssessment } from "api/schema"
import BaseLayout from "components/BaseLayout"
import ProfileForm from "components/project/profile/ProfileForm"
import { I18nPage, includeDefaultNamespaces, withTranslation } from "services/i18n"

type PageProps = WithTranslation

const ProjectProfilePage: I18nPage<PageProps> = () => {
  const p1: IProject = {
    delimitation: "Wir grenzen uns von anderen Projekten ab durch ...",
    description: "etwas längere Beschreibung, kann HTML enthalten",
    goal: "Unser Ziel ist die <ul><li>Weltherrschaft</li><li>Erschaffung neuer Welten</li></ul>",
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
    vision: "Element mit <b>HTML</b>",
  }

  return <BaseLayout pageTitle="Projektprofil">
    <ProfileForm project={p1} onSubmit={(values) => { console.log(values) }} />
  </BaseLayout>
}

ProjectProfilePage.getInitialProps = () => ({
  namespacesRequired: includeDefaultNamespaces(),
})

export default withTranslation(includeDefaultNamespaces())(ProjectProfilePage)
