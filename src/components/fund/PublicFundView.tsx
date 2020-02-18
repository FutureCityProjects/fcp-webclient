import React from "react"
import { Card, CardBody, CardHeader } from "reactstrap"

import { FundState, IFund, IFundConcretization } from "api/schema"
import HtmlContent from "components/common/HtmlContent"
import Icon from "components/common/Icon"
import { useTranslation } from "services/i18n"

interface IProps {
  fund: IFund
}

const PublicFundView: React.FC<IProps> = ({ fund }: IProps) => {
  const { t } = useTranslation()

  const stateText = fund.state === FundState.ACTIVE
    ? <span className="text-success">aktiv</span>
    : (fund.state === FundState.FINISHED
      ? <span className="text-muted">abgeschlossen</span>
      : <span className="text-warning">inaktiv</span>
    )

  return <>
    <Card>
      <CardHeader      >
        <div className="title-section">
          <h3>{fund.name} <Icon name="pot" size={24} /></h3>
          {stateText}
        </div>
      </CardHeader>
      <CardBody>
        <div className="rte-content">
          <HtmlContent content={fund.description} />
        </div>

        <h4>{t("fund.region")}</h4>
        <div className="rte-content">
          <HtmlContent content={fund.region} />
        </div>


        <h4>{t("fund.criteria")}</h4>
        {fund.criteria && fund.criteria.length
          ? <ul>
            {fund.criteria.map((c, index) => <li key={index}>{c}</li>)}
          </ul>
          : t("default.empty")
        }

        <h4>{t("fund.sponsor")}</h4>
        <div className="rte-content">
          <HtmlContent content={fund.sponsor} />
        </div>

        <h4>{t("fund.imprint")}</h4>
        <div className="rte-content">
          <HtmlContent content={fund.imprint} />
        </div>
      </CardBody>
    </Card>

    <Card>
      <CardHeader>
        {t("page.management.funds.details.fundingHeader")}
      </CardHeader>
      <CardBody>
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
      </CardBody>
    </Card>

    <Card>
      <CardHeader>
        {t("page.management.funds.details.applicationHeader")}
      </CardHeader>
      <CardBody>
        <h5>{t("fund.submissionBegin")}</h5>
        {fund.submissionBegin
          ? t("default.longDateTime", { value: fund.submissionBegin })
          : t("default.empty")}

        <h5>{t("fund.submissionEnd")}</h5>
        {fund.submissionEnd
          ? t("default.longDateTime", { value: fund.submissionEnd })
          : t("default.empty")}

        <h5 id="concretizations">{t("fund.concretizations")}</h5>
        {fund.concretizations && fund.concretizations.length > 0 && <ul>
          {fund.concretizations.map((c: IFundConcretization) => <li key={c.id}>
            <dt>
              {c.question}
            </dt>
            {c.description && <dd className="rte-content"><HtmlContent content={c.description} /></dd>}
          </li>)}
        </ul>}
      </CardBody>
    </Card>
  </>
}

export default PublicFundView
