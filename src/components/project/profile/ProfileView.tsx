import React from "react"
import { Card, CardBody, CardHeader } from "reactstrap"

import { IProject } from "api/schema"
import DropdownComponent from "components/common/DropdownComponent"
import HtmlContent from "components/common/HtmlContent"
import RangeSlider from "components/common/RangeSlider"
import Icon from "components/Icon"
import Link from "next/link"
import { Routes, routeWithParams } from "services/routes"

interface IProps {
  project: IProject
}

export default class ProfileView extends React.Component<IProps> {
  public render() {
    const { project } = this.props

    return <Card className="body-card">
      <CardHeader>
        {project.name ? project.name : "[unbenanntes Projekt]"}

        <div className={"icon-navigation"}>
          <Link href={Routes.PROJECT_PROFILE_EDIT}
            as={routeWithParams(Routes.PROJECT_PROFILE_EDIT, { slug: project.slug || project.id })}
          >
            <a aria-label="edit profile" className="navigation-item" title="Profil bearbeiten">
              <Icon name={"pencil"} size={24} />
            </a>
          </Link>
          <DropdownComponent button={<Icon name="grid" size={24} />}>
            <Link href={Routes.MY_PROJECTS}>
              <a>zurück</a>
            </Link>
          </DropdownComponent>
        </div>
      </CardHeader>

      <h2 className="card-title">Projektprofil</h2>
      <CardBody className="card-body-2-columns">
        <div className="column">
          <h3>Das Projekt in einem Satz</h3>
          {project.shortDescription}

          <h3>Beschreibung</h3>
          <HtmlContent content={project.description} />

          <h3>Herausforderungen</h3>
          <HtmlContent content={project.challenges} />
        </div>
        <div className="column">
          <h3>Ziel</h3>
          <HtmlContent content={project.goal} />

          <h3>Vision</h3>
          <HtmlContent content={project.vision} />

          <h3>Abgrenzung</h3>
          <HtmlContent content={project.delimitation} />

          <h3>Profil-Status</h3>
          <RangeSlider
            labels={{
              0: "erster Anfang",
              25: "gut vorangekommen",
              50: "halbfertig",
              75: "fast fertig",
              100: "vollständig!",
            }}
            value={project.profileSelfAssessment}
            static
          />
        </div>
      </CardBody>
    </Card >
  }
}
