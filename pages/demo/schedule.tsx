import { WithTranslation } from "next-i18next"
import React from "react"

import { IProject, ProjectProgress, SelfAssessment } from "api/schema"
import BaseLayout from "components/BaseLayout"
import PlanContainer from "components/project/common/PlanContainer"
import ProjectTimetable from "components/project/timetable/ProjectTimetable"
import { I18nPage, includeDefaultNamespaces, withTranslation } from "services/i18n"

type PageProps = WithTranslation

const ProjectWorkPackagesPage: I18nPage<PageProps> = () => {
  const p1: IProject = {
    createdAt: new Date(),
    delimitation: "Wir grenzen uns von anderen Projekten ab durch ...",
    description: "etwas längere Beschreibung, kann HTML enthalten",
    goal: "Unser Ziel ist die <ul><li>Weltherrschaft</li><li>Erschaffung neuer Welten</li</ul>",
    id: 10,
    implementationBegin: new Date(2020, 9),
    implementationTime: 9,
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
        months: [1],
        id: "1"
      },
      {
        description: "Ohne Arbeitspaket",
        workPackage: "rs27g3a7v",
        months: [3, 4, 5, 6],
        id: "2"
      },
      {
        description: "Noch eine Aufgabe",
        workPackage: "tj843kf84",
        months: [1],
        id: "3"
      },
      {
        description: "Organisation apdoj püfo opAJK SLdjd alsdj ASÄLKdjsä ldfkjsäldkj sdälkfj äflkjl kaljd lakj kld j",
        workPackage: "tj843kf84",
        months: [2, 3, 4, 5],
        id: "4"
      },
      {
        description: "Die letzte Aufgabe",
        workPackage: "tj843kf84",
        months: [6, 7],
        id: "5"
      },
      {
        description: "Allerletzte Aufgabe",
        workPackage: null,
        months: [],
        id: "6"
      }
    ],
    vision: "Element mit <b>HTML</b>",
    workPackages: [
      {
        id: "ab0c5de7f",
        name: "Arbeitspaket 01",
        description: "Die wichtigsten Aufgaben",
        mainResponsibility: "Norbert Rost",
        // tasks kann dann zur Laufzeit angelegt/befüllt werden, siehe Schema
      },
      {
        id: "rs27g3a7v",
        name: "Arbeitspaket 02",
        description: "Die wichtigsten Aufgaben",
        mainResponsibility: "Norbert Rost",
        // tasks kann dann zur Laufzeit angelegt/befüllt werden, siehe Schema
      },
      {
        id: "tj843kf84",
        name: "Arbeitspaket 03",
        description: "Die wichtigsten Aufgaben",
        mainResponsibility: "Norbert Rost",
        // tasks kann dann zur Laufzeit angelegt/befüllt werden, siehe Schema
      }
    ]
  }

  return <BaseLayout pageTitle="Zeitplan im Projektplan">
    <PlanContainer
      component={ProjectTimetable}
      project={p1}
      updateProject={(values) => console.log(values)}
    />
  </BaseLayout>
}

ProjectWorkPackagesPage.getInitialProps = async () => ({
  namespacesRequired: includeDefaultNamespaces(),
})

export default withTranslation(includeDefaultNamespaces())(ProjectWorkPackagesPage)
