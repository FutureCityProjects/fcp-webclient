import React from "react"
import { Card, CardBody, CardHeader, UncontrolledCollapse } from "reactstrap"

import { IProject } from "api/schema"
import HtmlContent from "components/common/HtmlContent"
import Icon from "components/common/Icon"
import Link from "next/link"
import { useTranslation } from "services/i18n"
import { Routes, routeWithParams } from "services/routes"

interface IProps {
  project: IProject
}

const UtilizationView: React.FC<IProps> = (props: IProps) => {
  const { t } = useTranslation()
  const { project } = props

  return <Card className="body-card">
    <CardHeader
      aria-expanded="false"
    >
      <div className="title-section" >
        <h3>{t("project.utilization")}</h3>
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
        <a id={"toggler-utilization"}
          className="toggler navigation-item caret"
          onClick={() => document.getElementById("caret-utilization").classList.toggle("caret-toggled")}
        >
          <span id={"caret-utilization"}><Icon name="caret" size={24} /></span>
        </a>
      </div>
    </CardHeader>

    <UncontrolledCollapse toggler={"#toggler-utilization"}>
      <CardBody>
        {project.utilization
          ? <HtmlContent content={project.utilization} />
          : <p>{t("default.empty")}</p>
        }
      </CardBody>
    </UncontrolledCollapse>
  </Card>
}

export default UtilizationView
