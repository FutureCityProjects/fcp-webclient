import { WithTranslation } from "next-i18next"
import React from "react"

import { IProject, ProjectProgress, SelfAssessment } from "api/schema"
import BaseLayout from "components/BaseLayout"
import PlanContainer from "components/project/common/PlanContainer"
import ProjectFinances from "components/project/finances/ProjectFinances"
import { I18nPage, includeDefaultNamespaces, withTranslation } from "services/i18n"

type PageProps = WithTranslation

const ProjectFinancesPage: I18nPage<PageProps> = () => {
  const p1: IProject = {
    createdAt: new Date(),
    delimitation: "Wir grenzen uns von anderen Projekten ab durch ...",
    description: "etwas längere Beschreibung, kann HTML enthalten",
    goal: "Unser Ziel ist die <ul><li>Weltherrschaft</li><li>Erschaffung neuer Welten</li</ul>",
    id: 10,
    implementationTime: 5,
    inspiration: {
      id: 1,
      shortDescription: "die Inspiration",
    },
    name: "Testprojekt",
    profileSelfAssessment: SelfAssessment.MakingProgress,
    progress: ProjectProgress.CreatingPlan,
    shortDescription: "Lorem ipsum dolor sit amet, consectetuer adipiscing elit. Aenean commodo ligula eget dolor. Aenean massa. Cum sociis natoque penatibus et magnis dis parturient montes, nascetur ridiculus mus. Donec quam felis, ultricies nec, pellentesque eu, pretium quis, sem. Nulla consequat mas",
    slug: "testprojekt",
    resourceRequirements: [
      {
        cost: 5,
        description: "Eigenanteil",
        id: "r11111",
        task: "t11111",
      },
      {
        cost: 95,
        description: "Fördermittel",
        id: "r22222",
        task: "t11111",
      },
      {
        cost: 7777.77,
        description: "Personalkosten",
        id: "r33333",
        task: "t22222",
      },
    ],
    tasks: [
      {
        description: "Die erste Aufgabe",
        id: "t11111",
        workPackage: "w11111",
        months: [1, 2, 3]
      },
      {
        description: "Ohne Arbeitspaket",
        id: "t22222",
        workPackage: null,
        months: [3, 4, 5]
      },
      {
        description: "Lorem ipsum dolor sit amet, consectetuer adipiscing elit. Aenean commodo ligula eget.",
        id: "t33333",
        workPackage: "w22222",
        months: [4, 5]
      },
      {
        description: "Lorem ipsum dolor sit amet, consectetuer adipiscing elit. Aenean commodo ligula eget.",
        id: "t44444",
        workPackage: "w22222",
        months: [4, 5]
      },
      {
        description: "Lorem ipsum dolor sit amet, consectetuer adipiscing elit. Aenean commodo ligula eget.",
        id: "t55555",
        workPackage: null,
        months: [4, 5]
      }
    ],
    vision: "Element mit <b>HTML</b>",
    workPackages: [
      {
        id: "w11111",
        name: "Marketing",
        description: "Die wichtigsten Aufgaben",
        mainResponsibility: "Norbert Rost",
        order: 1,
      },
      {
        id: "w22222",
        name: "Milestone 2",
        description: "Die wichtigsten Aufgaben",
        mainResponsibility: "Norbert Rost",
        order: 2,
      },
      {
        id: "w33333",
        name: "M3",
        description: "Die wichtigsten Aufgaben",
        mainResponsibility: "Norbert Rost",
        order: 3,
      }
    ]
  }

  return <BaseLayout pageTitle="Projektfinanzierung">
    <PlanContainer
      component={ProjectFinances}
      project={p1}
      // eslint-disable-next-line no-console
      updateProject={(values) => console.log(values)}
    />
  </BaseLayout>
}

ProjectFinancesPage.getInitialProps = () => ({
  namespacesRequired: includeDefaultNamespaces(),
})

export default withTranslation(includeDefaultNamespaces())(ProjectFinancesPage)
