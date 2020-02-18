import React from "react"
import { Card, CardHeader, Col, Row, UncontrolledCollapse } from "reactstrap"

import { IFund } from "api/schema"
import ConfirmationForm from "components/common/form/ConfirmationForm"
import HtmlContent from "components/common/HtmlContent"
import Icon from "components/common/Icon"
import { useTranslation } from "services/i18n"

interface IProps {
  fund: IFund
  selectable: boolean
  selectFund: any
}

function handleClick(id) {
  document.getElementById("caret-" + id).classList.toggle("caret-toggled")
}

const SelectFundCard: React.FC<IProps> = ({ fund, selectable, selectFund }: IProps) => {
  const { t } = useTranslation()

  return <Card role="fund info" className="collapse-card">
    <CardHeader
      id={"toggler-" + fund.id}
      className="toggler"
      onClick={() => handleClick(fund.id)}
      aria-expanded="false"
    >
      <div className="title-section">
        <h3>{fund.name}</h3>
      </div>
      <span id={"caret-" + fund.id} className="caret"><Icon name="caret" size={24} /></span>
    </CardHeader>

    <UncontrolledCollapse toggler={"#toggler-" + fund.id}>
      <div className="card-block">
        <Row>
          <Col lg>
            <h5>{t("fund.description")}</h5>
            <div className="rte-content">
              <HtmlContent content={fund.description} />
            </div>

            <h5>{t("fund.region")}</h5>
            <div className="rte-content">
              <HtmlContent content={fund.region} />
            </div>

            <h5>{t("fund.criteria")}</h5>
            {fund.criteria && fund.criteria.length
              ? <ul>
                {fund.criteria.map((c, index) => <li key={index}>{c}</li>)}
              </ul>
              : t("default.empty")
            }

            <h5>{t("fund.sponsor")}</h5>
            <div className="rte-content">
              <HtmlContent content={fund.sponsor} />
            </div>

            <h5>{t("fund.imprint")}</h5>
            <div className="rte-content">
              <HtmlContent content={fund.imprint} />
            </div>
          </Col>
          <Col lg>
            <h5>{t("fund.budget")}</h5>
            {fund.budget
              ? t("default.currency", { value: fund.budget })
              : t("default.empty")}

            <h5>{t("fund.minimumGrant")}</h5>
            {fund.minimumGrant
              ? t("default.currency", { value: fund.minimumGrant })
              : t("default.empty")}

            <h5>{t("fund.maximumGrant")}</h5>
            {fund.maximumGrant
              ? t("default.currency", { value: fund.maximumGrant })
              : t("default.empty")}

            <h5>{t("fund.submissionBegin")}</h5>
            {t("default.longDateTime", { value: fund.submissionBegin })}

            <h5>{t("fund.submissionEnd")}</h5>
            {t("default.longDateTime", { value: fund.submissionEnd })}
          </Col>
        </Row>
        {selectable && <Row>
          <Col lg={12} className="text-center">
            <ConfirmationForm
              buttonLabel="page.projects.application.selectFund.selectThisFund"
              onSubmit={selectFund}
            />
          </Col>
        </Row>}
      </div>
    </UncontrolledCollapse>
  </Card>
}

export default SelectFundCard
