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

const OutcomeView: React.FC<IProps> = (props: IProps) => {
  const { t } = useTranslation()
  const { project } = props

  return <Card className="body-card">
    <CardHeader
      aria-expanded="false"
    >
      <div className="title-section" >
        <h3>{t("project.outcome")}: {project.outcome ? project.outcome.length : 0}</h3>
      </div>
      <div className={"icon-navigation"}>
        <Link
          href={Routes.projectPlanEdit}
          as={routeWithParams(Routes.projectPlanEdit, { slug: project.slug || project.id })}
        >
          <a aria-label={t("goto.editProjectPlan")} className="navigation-item" title={t("goto.editProjectPlan")}>
            <Icon name={"pencil"} size={24} />
          </a>
        </Link>
        <a id={"toggler-outcome"}
          className="toggler navigation-item caret"
          onClick={() => document.getElementById("caret-outcome").classList.toggle("caret-toggled")}
        >
          <span id={"caret-outcome"}><Icon name="caret" size={24} /></span>
        </a>
      </div>
    </CardHeader>

    <UncontrolledCollapse toggler={"#toggler-outcome"}>
      <CardBody>
        {project.outcome && project.outcome.length
          ? <ul>
            {project.outcome.map((group, index) => <li key={index}>{group}</li>)}
          </ul>
          : t("default.empty")
        }
      </CardBody>
    </UncontrolledCollapse>
  </Card>
}

export default OutcomeView
