import React from "react"
import { Card, CardBody, CardHeader } from "reactstrap"

import { IFund, IFundApplication, IProject } from "api/schema"
import Icon from "components/common/Icon"
import Link from "next/link"
import { useTranslation } from "services/i18n"
import { Routes, routeWithParams } from "services/routes"

interface IProps {
  application: IFundApplication
  fund: IFund
  project: IProject
}

const FundingView: React.FC<IProps> = ({ application, fund, project }: IProps) => {
  const { t } = useTranslation()

  return <Card className="body-card">
    <CardHeader>
      <div className="title-section" >
        <h3>{t("project.fundingData")}</h3>
      </div>
    </CardHeader>
    <CardBody>
      <h5>{t("fundApplication.fund")}</h5>
      {fund.name}

      <h5>{t("fundApplication.requestedFunding")}</h5>
      {application.requestedFunding
        ? t("default.currency", { value: application.requestedFunding })
        : t("default.empty")}
      <Link href={{
        pathname: Routes.ProjectFundingEdit,
        // @todo support multiple applications, how to store which one is the active application?
        query: { fund: fund.id }
      }} as={{
        pathname: routeWithParams(Routes.ProjectFundingEdit, { slug: project.slug || project.id }),
        // @todo support multiple applications, how to store which one is the active application?
        query: { fund: fund.id }
      }} >
        <a className="btn" title={t("goto.editRequestedFunding")}>
          <Icon name="pencil" size={24} /></a>
      </Link>
    </CardBody>
  </Card>
}

export default FundingView
