import React from "react"
import { Card, CardBody, CardHeader } from "reactstrap"

import { ResourceSourceType } from "api/schema"
import Icon from "components/common/Icon"
import Link from "next/link"
import { useTranslation } from "services/i18n"
import { Routes, routeWithParams } from "services/routes"
import { IPlanProps } from "../common/PlanContainer"

const FinancesView: React.FC<IPlanProps> = (props: IPlanProps) => {
  const { t } = useTranslation()
  const { functions, project } = props

  const resourceRequirements = functions.getResourceRequirements()
  const totalSum = resourceRequirements.length && functions.sumResourceRequirementCosts(resourceRequirements)
  const fundingSum = resourceRequirements.length && functions.sumResourceRequirementCosts(
    functions.getResourceRequirementsBySourceType(ResourceSourceType.SOURCE_TYPE_FUNDING)
  )
  const ownCosts = resourceRequirements.length && functions.sumResourceRequirementCosts(
    functions.getResourceRequirementsBySourceType(ResourceSourceType.SOURCE_TYPE_OWN_FUNDS)
  )
  const proceeds = resourceRequirements.length && functions.sumResourceRequirementCosts(
    functions.getResourceRequirementsBySourceType(ResourceSourceType.SOURCE_TYPE_PROCEEDS)
  )

  return <Card className="body-card">
    <CardHeader  >
      <div className="title-section" >
        <h3>{t("page.projects.plan.index.financesHeader")}</h3>
      </div>
      <div className={"icon-navigation"}>
        <Link
          href={Routes.projectPlanFinances}
          as={routeWithParams(Routes.projectPlanFinances, { slug: project.slug || project.id })}
        >
          <a className="navigation-item" aria-label={t("goto.editProjectFinances")} title={t("goto.editProjectFinances")}>
            <Icon name={"pencil"} size={24} />
          </a>
        </Link>
      </div>
    </CardHeader>
    <CardBody>
      {t("project.resourceRequirement.totalSum")}: {t("default.currency", { value: totalSum })}

      {totalSum > 0 && <>
        <br /><br />{t("page.projects.plan.index.financeParts")}:
        <br />
        {t("project.resourceRequirement.fundingSum")}: {t("default.currency", { value: fundingSum })}
        <br />
        {t("project.resourceRequirement.ownCostsSum")}: {t("default.currency", { value: ownCosts })}
        <br />
        {t("project.resourceRequirement.proceedsSum")}: {t("default.currency", { value: proceeds })}
      </>}
    </CardBody>
  </Card>
}

export default FinancesView
