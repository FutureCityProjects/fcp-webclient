import Link from "next/link"
import React from "react"
import { Card, CardBody, CardHeader, Col, Row } from "reactstrap"

import { IProject } from "api/schema"
import DropdownComponent from "components/common/DropdownComponent"
import HtmlContent from "components/common/HtmlContent"
import Icon from "components/common/Icon"
import { useTranslation } from "services/i18n"
import { Routes, routeWithParams } from "services/routes"

interface IProps {
  project: IProject
}

const PublicProfile: React.FC<IProps> = ({ project }: IProps) => {
  const { t } = useTranslation()

  return <Card>
    <div className="project-profile">
      <CardHeader>
        {project.shortDescription}
        <div className={"icon-navigation"}>
          <DropdownComponent button={<Icon name="user-add" size={36} />}>
            <Link href={Routes.PROJECT_APPLICATION}
              as={routeWithParams(Routes.PROJECT_APPLICATION, { slug: project.slug || project.id })}
            >
              <a>{t("goto.memberApplication")}</a>
            </Link>
          </DropdownComponent>
        </div>
      </CardHeader>
      <CardBody>
        <Row>
          <Col lg>
            {project.description && <div className="form-group">
              <br />
              <h3>{t("project.description")}</h3>
              <HtmlContent content={project.description} />
            </div>}

            {project.challenges && <div className="form-group">
              <br />
              <h3>{t("project.challenges")}</h3>
              <HtmlContent content={project.challenges} />
            </div>}

            {project.goal && <div className="form-group">
              <br />
              <h3>{t("project.goal")}</h3>
              <HtmlContent content={project.goal} />
            </div>}

            {project.vision && <div className="form-group">
              <br />
              <h3>{t("project.vision")}</h3>
              <HtmlContent content={project.vision} />
            </div>}

            {project.delimitation && <div className="form-group">
              <br />
              <h3>{t("project.delimitation")}</h3>
              <HtmlContent content={project.delimitation} />
            </div>}
          </Col>

          <Col lg>
            <div className="text-center">
              <img className="img-fluid img-thumbnail rounded mx-auto " src="/assets/img/project_placeholder.jpg" title="Platzhalter" alt="Platzhalter" />
            </div>

            <br />
            <p>
              {t("project.progress.label")}: {t("project.progress." + project.progress)}
            </p>
            <p>
              {t("project.updatedAt")}: {t("default.longDate", { value: project.updatedAt })}
            </p>
          </Col>
        </Row>
      </CardBody>
    </div>
  </Card>
}

export default PublicProfile