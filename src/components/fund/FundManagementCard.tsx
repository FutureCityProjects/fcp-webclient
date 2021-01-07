import Link from "next/link"
import React from "react"
import { Card, CardBody, CardHeader, UncontrolledCollapse } from "reactstrap"

import { FundState, IFund } from "api/schema"
import HtmlContent from "components/common/HtmlContent"
import Icon from "components/common/Icon"
import { useTranslation } from "services/i18n"
import { Routes, routeWithParams } from "services/routes"

interface IProps {
  fund: IFund
}

const handleClick = (id: number) =>
  document.getElementById("caret-" + id.toString()).classList.toggle("caret-toggled")

const FundManagementCard: React.FC<IProps> = ({ fund }: IProps) => {
  const { t } = useTranslation()

  const stateText = fund.state === FundState.Active
    ? <span className="text-success">aktiv</span>
    : (fund.state === FundState.Finished
      ? <span className="text-muted">abgeschlossen</span>
      : <span className="text-warning">inaktiv</span>
    )

  return (
    <Card role="fund info" className="collapse-card">
      <CardHeader
        id={"toggler-" + fund.id.toString()}
        className="toggler"
        onClick={() => handleClick(fund.id)}
        aria-expanded="false"
      >
        <div className="title-section">
          <h3>{fund.name}</h3> {stateText}
        </div>
        <span id={"caret-" + fund.id.toString()} className="caret"><Icon name="caret" size={24} /></span>
      </CardHeader>

      <UncontrolledCollapse toggler={"#toggler-" + fund.id.toString()}>
        <CardBody>
          <div role="actions" className="icon-navigation">
            <Link href={Routes.FundDetails} as={routeWithParams(Routes.FundDetails, { id: fund.id })}>
              <a aria-label={t("goto.fundDetails")} className="navigation-item" title={t("goto.fundDetails")}>
                <Icon name={"search"} size={24} />
              </a>
            </Link>
            <Link href={Routes.FundEdit} as={routeWithParams(Routes.FundEdit, { id: fund.id })}>
              <a aria-label={t("goto.editFund")} className="navigation-item" title={t("goto.editFund")}>
                <Icon name={"pencil"} size={24} />
              </a>
            </Link>
          </div>

          <h4>{t("fund.description")}</h4>
          <div className="rte-content">
            <HtmlContent content={fund.description} />
          </div>

          <h4>{t("fund.region")}</h4>
          <div className="rte-content">
            <HtmlContent content={fund.region} />
          </div>
        </CardBody>
      </UncontrolledCollapse>

    </Card>
  )
}

export default FundManagementCard
