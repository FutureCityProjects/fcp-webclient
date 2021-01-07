import React from "react"
import { Card, CardBody, CardHeader } from "reactstrap"

import Icon from "components/common/Icon"
import TranslatedHtml from "components/common/TranslatedHtml"
import Link from "next/link"
import { useTranslation } from "services/i18n"
import { Routes, routeWithParams } from "services/routes"
import { IPlanProps } from "../common/PlanContainer"

const ImplementationView: React.FC<IPlanProps> = (props: IPlanProps) => {
  const { t } = useTranslation()
  const { project } = props

  return <Card className="body-card">
    <CardHeader  >
      <div className="title-section" >
        <h3>{t("page.projects.plan.index.timetable")}</h3>
      </div>
      <div className={"icon-navigation"}>
        <Link
          href={Routes.ProjectPlanTimetable}
          as={routeWithParams(Routes.ProjectPlanTimetable, { slug: project.slug || project.id })}
        >
          <a className="navigation-item" aria-label={t("goto.editTimetable")} title={t("goto.editTimetable")}>
            <Icon name={"pencil"} size={24} />
          </a>
        </Link>
      </div>
    </CardHeader>
    <CardBody>
      {t("project.implementationBegin")}: {project.implementationBegin
        ? <TranslatedHtml content="default.longMonthYear" params={{ value: project.implementationBegin }} />
        : t("default.empty")}
      <br />
      {t("project.implementationTime")}: {project.implementationTime
        ? t("default.months", { count: project.implementationTime })
        : t("default.empty")}
    </CardBody>
  </Card>
}

export default ImplementationView
