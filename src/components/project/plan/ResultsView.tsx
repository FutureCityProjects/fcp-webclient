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

const ResultsView: React.FC<IProps> = (props: IProps) => {
  const { t } = useTranslation()
  const { project } = props

  return <Card className="body-card">
    <CardHeader
      aria-expanded="false"
    >
      <div className="title-section" >
        <h3>{t("project.results")}: {project.results ? project.results.length : 0}</h3>
      </div>
      <div className={"icon-navigation"}>
        <Link
          href={Routes.PROJECT_PLAN_EDIT}
          as={routeWithParams(Routes.PROJECT_PLAN_EDIT, { slug: project.slug || project.id })}
        >
          <a aria-label={t("goto.editProjectPlan")} className="navigation-item" title={t("goto.editProjectPlan")}>
            <Icon name={"pencil"} size={24} />
          </a>
        </Link>
        <a id={"toggler-results"}
          className="toggler navigation-item caret"
          onClick={() => document.getElementById("caret-results").classList.toggle("caret-toggled")}
        >
          <span id={"caret-results"}><Icon name="caret" size={24} /></span>
        </a>
      </div>
    </CardHeader>

    <UncontrolledCollapse toggler={"#toggler-results"}>
      <CardBody>
        {project.results && project.results.length
          ? <ul>
            {project.results.map((group, index) => <li key={index}>{group}</li>)}
          </ul>
          : t("default.empty")
        }
      </CardBody>
    </UncontrolledCollapse>
  </Card>
}

export default ResultsView
