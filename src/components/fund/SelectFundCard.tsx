import React from "react"
import { Card, CardHeader, Col, Row, UncontrolledCollapse } from "reactstrap"

import { IFund } from "api/schema"
import ConfirmationForm from "components/common/form/ConfirmationForm"
import HtmlContent from "components/common/HtmlContent"
import Icon from "components/Icon"
import { DateFormat, formatDate, TimeFormat } from "services/dateFormat"
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
          <Col lg={6}>
            <h5>{t("fund.description")}</h5>
            <HtmlContent content={fund.description} />

            <h5>{t("fund.region")}</h5>
            <p><HtmlContent content={fund.region} /></p>

            <h5>{t("fund.criteria")}</h5>
            {fund.criteria && fund.criteria.length
              ? <ul>
                {fund.criteria.map((c, index) => <li key={index}>{c}</li>)}
              </ul>
              : <p>{t("default.empty")}</p>
            }

            <h5>{t("fund.sponsor")}</h5>
            <HtmlContent content={fund.sponsor} />

            <h5>{t("fund.imprint")}</h5>
            <HtmlContent content={fund.imprint} />
          </Col>
          <Col lg={6}>
            <h5>{t("fund.budget")}</h5>
            <p>{fund.budget}</p>

            <h5>{t("fund.maximumGrant")}</h5>
            <p>{fund.maximumGrant}</p>

            <h5>{t("fund.minimumGrant")}</h5>
            <p>{fund.minimumGrant}</p>

            <h5>{t("fund.submissionBegin")}</h5>
            <p>{formatDate(fund.submissionBegin, DateFormat.LONG, TimeFormat.MINUTES)}</p>

            <h5>{t("fund.submissionEnd")}</h5>
            <p>{formatDate(fund.submissionEnd, DateFormat.LONG, TimeFormat.MINUTES)}</p>
          </Col>
        </Row>
        {selectable && <Row>
          <Col lg={12} className="text-center">
            <ConfirmationForm
              buttonLabel="page.projects.selectFund.selectThisFund"
              onSubmit={selectFund}
            />
          </Col>
        </Row>}
      </div>
    </UncontrolledCollapse>
  </Card>
}

export default SelectFundCard
