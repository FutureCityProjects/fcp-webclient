import { WithTranslation } from "next-i18next"
import React from "react"

import { IProject, ProjectProgress, SelfAssessment } from "api/schema"
import BaseLayout from "components/BaseLayout"
import PlanContainer from "components/project/common/PlanContainer"
import ProjectTasks from "components/project/tasks/ProjectTasks"
import { I18nPage, includeDefaultNamespaces, withTranslation } from "services/i18n"

type PageProps = WithTranslation

const ProjectTasksPage: I18nPage<PageProps> = () => {
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
    tasks: [
      {
        description: "Die erste Aufgabe",
        id: "112312312",
        workPackage: "ab0c5de7f",
        months: [1, 2, 3]
      },
      {
        description: "Ohne Arbeitspaket",
        id: "212312312",
        workPackage: null,
        months: [3, 4, 5]
      },
      {
        description: "Lorem ipsum dolor sit amet, consectetuer adipiscing elit. Aenean commodo ligula eget.",
        id: "312312312",
        workPackage: null,
        months: [4, 5]
      },
      {
        description: "Lorem ipsum dolor sit amet, consectetuer adipiscing elit. Aenean commodo ligula eget.",
        id: "412312312",
        workPackage: null,
        months: [4, 5]
      },
      {
        description: "Lorem ipsum dolor sit amet, consectetuer adipiscing elit. Aenean commodo ligula eget.",
        id: "512312312",
        workPackage: null,
        months: [4, 5]
      }
    ],
    vision: "Element mit <b>HTML</b>",
    workPackages: [
      {
        id: "ab0c5de7f",
        name: "AP1",
        description: "Die wichtigsten Aufgaben",
        mainResponsibility: "Norbert Rost",
        // tasks kann dann zur Laufzeit angelegt/befüllt werden, siehe Schema
      }
    ]
  }

  return <BaseLayout pageTitle="Aufgaben im Projektplan">
    <PlanContainer
      component={ProjectTasks}
      project={p1}
      // eslint-disable-next-line no-console
      updateProject={(values) => console.log(values)}
    />
  </BaseLayout>
}

ProjectTasksPage.getInitialProps = () => ({
  namespacesRequired: includeDefaultNamespaces(),
})

export default withTranslation(includeDefaultNamespaces())(ProjectTasksPage)
