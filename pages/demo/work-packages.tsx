import { WithTranslation } from "next-i18next"
import React from "react"

import { IProject, ProjectProgress, SelfAssessment } from "api/schema"
import BaseLayout from "components/BaseLayout"
import PlanContainer from "components/project/common/PlanContainer"
import ProjectWorkPackages from "components/project/work-packages/ProjectWorkPackages"
import { I18nPage, includeDefaultNamespaces, withTranslation } from "services/i18n"

type PageProps = WithTranslation

const ProjectWorkPackagesPage: I18nPage<PageProps> = () => {
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
    profileSelfAssessment: SelfAssessment.MAKING_PROGRESS,
    progress: ProjectProgress.CREATING_PLAN,
    shortDescription: "Lorem ipsum dolor sit amet, consectetuer adipiscing elit. Aenean commodo ligula eget dolor. Aenean massa. Cum sociis natoque penatibus et magnis dis parturient montes, nascetur ridiculus mus. Donec quam felis, ultricies nec, pellentesque eu, pretium quis, sem. Nulla consequat mas",
    slug: "testprojekt",
    tasks: [
      {
        description: "Die erste Aufgabe",
        workPackage: "ab0c5de7f",
        months: [1, 2, 3],
        id: "1"
      },
      {
        description: "Ohne Arbeitspaket",
        workPackage: null,
        months: [3, 4, 5],
        id: "2"
      },
      {
        description: "Lorem ipsum dolor sit amet, consectetuer adipiscing elit. Aenean commodo ligula eget dolor. Aenean massa. Cum sociis natoque penatibus et magnis dis parturient montes, nascetur ridiculus mus. Donec quam felis, ultricies nec, pellentesque eu, pretium quis, sem. Nulla consequat massa quis enim. Donec pede justo, fringilla vel, aliquet nec, vulputate eget, arcu. In enim justo, rhoncus ut, imperdiet a, venenatis vitae, justo. Nullam dictum felis eu pede mollis pretium. Integer tincidunt. Cras dapibu",
        workPackage: null,
        months: [4, 5],
        id: "3"
      },
      {
        description: "Lorem ipsum dolor sit amet, consectetuer adipiscing elit. Aenean commodo ligula eget.",
        workPackage: null,
        months: [4, 5],
        id: "4"
      },
      {
        description: "Lorem ipsum dolor sit amet, consectetuer adipiscing elit. Aenean commodo ligula eget.",
        workPackage: null,
        months: [4, 5],
        id: "5"
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
      },
      {
        id: "2rs-27g3a7v",
        name: "AP2",
        description: "Lorem ipsum dolor sit amet, consectetuer adipiscing elit. Aenean commodo ligula eget dolor. Aenean massa. Cum sociis natoque penatibus et magnis dis parturient montes, nascetur ridiculus mus. Donec quam felis, ultricies nec, pellentesque eu, pretium quis, sem. Nulla consequat massa quis enim. Donec pede justo, fringilla vel, aliquet nec, vulputate eget, arcu. In enim justo, rhoncus ut, imperdiet a, venenatis vitae, justo. Nullam dictum felis eu pede mollis pretium. Integer tincidunt. Cras dapibu",
        mainResponsibility: "Norbert Rost",
        // tasks kann dann zur Laufzeit angelegt/befüllt werden, siehe Schema
      }
    ]
  }

  return <BaseLayout pageTitle="Arbeitspakete im Projektplan">
    <PlanContainer
      component={ProjectWorkPackages}
      project={p1}
      updateProject={(values) => console.log(values)}
    />
  </BaseLayout>
}

ProjectWorkPackagesPage.getInitialProps = async () => ({
  namespacesRequired: includeDefaultNamespaces(),
})

export default withTranslation(includeDefaultNamespaces())(ProjectWorkPackagesPage)
