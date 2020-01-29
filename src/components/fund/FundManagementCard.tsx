import Link from "next/link"
import React from "react"
import { Card, CardBody, CardHeader, UncontrolledCollapse } from "reactstrap"

import { FundState, IFund } from "api/schema"
import HtmlContent from "components/common/HtmlContent"
import Icon from "components/Icon"
import { Routes, routeWithParams } from "services/routes"

interface IProps {
  fund: IFund
}

function handleClick(id) {
  document.getElementById("caret-" + id).classList.toggle("caret-toggled")
}

const FundManagementCard: React.FC<IProps> = ({ fund }: IProps) => {
  const stateText = fund.state === FundState.ACTIVE
    ? <span className="text-success">aktiv</span>
    : (fund.state === FundState.FINISHED
      ? <span className="text-muted">abgeschlossen</span>
      : <span className="text-warning">inaktiv</span>
    )

  return (
    <Card role="fund info" className="collapse-card">
      <CardHeader
        id={"toggler-" + fund.id}
        className="toggler"
        onClick={() => handleClick(fund.id)}
        aria-expanded="false"
      >
        <div className="title-section">
          <h3>{fund.name}</h3> {stateText}
        </div>
        <span id={"caret-" + fund.id} className="caret"><Icon name="caret" size={24} /></span>
      </CardHeader>

      <UncontrolledCollapse toggler={"#toggler-" + fund.id}>
        <CardBody>
          <div role="actions" className="icon-navigation">
            <Link href={Routes.FUND_DETAILS} as={routeWithParams(Routes.FUND_DETAILS, { id: fund.id })}>
              <a aria-label="view details" className="navigation-item" title="Detailansicht">
                <Icon name={"search"} size={24} />
              </a>
            </Link>
            <Link href={Routes.FUND_EDIT} as={routeWithParams(Routes.FUND_EDIT, { id: fund.id })}>
              <a aria-label="edit fund" className="navigation-item" title="Fördertopf bearbeiten">
                <Icon name={"pencil"} size={24} />
              </a>
            </Link>
          </div>
          <h4>Beschreibung</h4>
          <HtmlContent content={fund.description} />

          <h4>Region</h4>
          <HtmlContent content={fund.region} />
        </CardBody>
      </UncontrolledCollapse>

    </Card>
  )
}

export default FundManagementCard
