import React from "react"
import { Card, CardBody, CardHeader, UncontrolledCollapse } from "reactstrap"

import { IProject } from "api/schema"
import Icon from "components/common/Icon"
import Link from "next/link"
import { useTranslation } from "services/i18n"
import { Routes, routeWithParams } from "services/routes"

interface IProps {
  project: IProject
}

const ImpactView: React.FC<IProps> = (props: IProps) => {
  const { t } = useTranslation()
  const { project } = props

  return <Card className="body-card">
    <CardHeader
      aria-expanded="false"
    >
      <div className="title-section" >
        <h3>{t("project.impact")}: {project.impact ? project.impact.length : 0}</h3>
      </div>
      <div className={"icon-navigation"}>
        <Link
          href={Routes.ProjectPlanEdit}
          as={routeWithParams(Routes.ProjectPlanEdit, { slug: project.slug || project.id })}
        >
          <a aria-label={t("goto.editProjectPlan")} className="navigation-item" title={t("goto.editProjectPlan")}>
            <Icon name={"pencil"} size={24} />
          </a>
        </Link>
        <a id={"toggler-impact"}
          className="toggler navigation-item caret"
          onClick={() => document.getElementById("caret-impact").classList.toggle("caret-toggled")}
        >
          <span id={"caret-impact"}><Icon name="caret" size={24} /></span>
        </a>
      </div>
    </CardHeader>

    <UncontrolledCollapse toggler={"#toggler-impact"}>
      <CardBody>
        {project.impact && project.impact.length
          ? <ul>
            {project.impact.map((group, index) => <li key={index}>{group}</li>)}
          </ul>
          : t("default.empty")
        }
      </CardBody>
    </UncontrolledCollapse>
  </Card>
}

export default ImpactView
