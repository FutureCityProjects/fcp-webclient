import React from "react"
import { Card, CardBody, CardHeader, Col, Row } from "reactstrap"

import { IProject, SelfAssessment } from "api/schema"
import DropdownComponent from "components/common/DropdownComponent"
import HtmlContent from "components/common/HtmlContent"
import Icon from "components/common/Icon"
import RangeSlider from "components/common/RangeSlider"
import Link from "next/link"
import { useTranslation } from "services/i18n"
import { Routes, routeWithParams } from "services/routes"

interface IProps {
  project: IProject
}

const ProfileView: React.FC<IProps> = (props: IProps) => {
  const { project } = props
  const { t } = useTranslation()

  return <Card className="body-card">
    <div className="profile-form">
      <CardHeader>
        <h3>{project.name ? project.name : t("project.unnamed")}</h3>
        <div className={"icon-navigation"}>
          <Link
            href={Routes.PROJECT_PROFILE_EDIT}
            as={routeWithParams(Routes.PROJECT_PROFILE_EDIT, { slug: project.slug || project.id })}
          >
            <a className="navigation-item" title={t("goto.editProjectProfile")} aria-label={t("goto.editProjectProfile")}>
              <Icon name={"pencil"} size={24} />
            </a>
          </Link>
          <DropdownComponent className="navigation-item" button={<Icon name="grid" size={24} />}>
            <Link href={Routes.MY_PROJECTS} as={Routes.MY_PROJECTS + "#project-" + project.id}>
              <a>{t("goto.myProjects")}</a>
            </Link>
          </DropdownComponent>
        </div>
      </CardHeader>
      <CardBody>
        <Row>
          <Col lg>
            <div className="form-group">
              <h3>{t("project.shortDescription")}</h3>
              <div>{project.shortDescription}</div>
            </div>
            <div className="form-group">
              <h3>{t("project.description")}</h3>
              <div>{project.description
                ? <HtmlContent content={project.description} />
                : t("default.empty")}
              </div>
            </div>
            <div className="form-group">
              <h3>{t("project.challenges")}</h3>
              <div>{project.challenges
                ? <HtmlContent content={project.challenges} />
                : t("default.empty")}
              </div>
            </div>
          </Col>
          <Col lg>
            <div className="form-group">
              <h3>{t("project.goal")}</h3>
              <div>{project.goal
                ? <HtmlContent content={project.goal} />
                : t("default.empty")}
              </div>
            </div>
            <div className="form-group">
              <h3>{t("project.vision")}</h3>
              <div>{project.vision
                ? <HtmlContent content={project.vision} />
                : t("default.empty")}
              </div>
            </div>
            <div className="form-group">
              <h3>{t("project.delimitation")}</h3>
              <div>{project.delimitation
                ? <HtmlContent content={project.delimitation} />
                : t("default.empty")}
              </div>
            </div>
            <div className="form-group">
              <h3>{t("project.profileSelfAssessment")}</h3>
              <RangeSlider
                labels={{
                  [SelfAssessment.STARTING]: t("progress.0"),
                  [SelfAssessment.MAKING_PROGRESS]: t("progress.25"),
                  [SelfAssessment.HALF_FINISHED]: t("progress.50"),
                  [SelfAssessment.ALMOST_FINISHED]: t("progress.75"),
                  [SelfAssessment.COMPLETE]: t("progress.100"),
                }}
                value={project.profileSelfAssessment}
                static
              />
            </div>
          </Col>
        </Row>
      </CardBody>
    </div>
  </Card >
}

export default ProfileView
