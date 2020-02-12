import { Col, Row } from "reactstrap"

import { ResourceSourceType } from "api/schema"
import { IPlanFunctions } from "components/project/common/PlanContainer"
import { useTranslation } from "services/i18n"

interface IProps {
  functions: IPlanFunctions
  showFinances?: boolean
}

const TotalSumCard: React.FC<IProps> = (props: IProps) => {
  const { t } = useTranslation()
  const { functions, showFinances = false } = props

  const resourceRequirements = functions.getResourceRequirements()
  const sum = functions.sumResourceRequirementCosts(resourceRequirements)
  const fundingSum = showFinances
    ? functions.sumResourceRequirementCosts(
      functions.getResourceRequirementsBySourceType(ResourceSourceType.SOURCE_TYPE_FUNDING)
    )
    : null
  const ownCosts = showFinances
    ? functions.sumResourceRequirementCosts(
      functions.getResourceRequirementsBySourceType(ResourceSourceType.SOURCE_TYPE_OWN_FUNDS)
    )
    : null
  const proceeds = showFinances
    ? functions.sumResourceRequirementCosts(
      functions.getResourceRequirementsBySourceType(ResourceSourceType.SOURCE_TYPE_PROCEEDS)
    )
    : null

  return <>
    {showFinances && <>
      <Row className="funding-sum">
        <Col sm={7}>
          <Row className="funding-sum-description d-block text-sm-right">{t("project.resourceRequirement.fundingSum")}:</Row>
        </Col>
        <Col sm={5}>
          <Row className="funding-sum-content d-block text-sm-right">{t("default.currency", { value: fundingSum })}</Row>
        </Col>
      </Row>
      <Row className="own-costs-sum">
        <Col sm={7}>
          <Row className="own-costs-description d-block text-sm-right">{t("project.resourceRequirement.ownCostsSum")}:</Row>
        </Col>
        <Col sm={5}>
          <Row className="own-costs-content d-block text-sm-right">{t("default.currency", { value: ownCosts })}</Row>
        </Col>
      </Row>
      <Row className="proceeds-sum">
        <Col sm={7}>
          <Row className="proceeds-sum-description d-block text-sm-right">{t("project.resourceRequirement.proceedsSum")}:</Row>
        </Col>
        <Col sm={5}>
          <Row className="proceeds-sum-content d-block text-sm-right">{t("default.currency", { value: proceeds })}</Row>
        </Col>
      </Row>
    </>}
    <Row className="total-sum">
      <Col sm={7}>
        <Row className="total-cost-description d-block text-sm-right">{t("project.resourceRequirement.totalSum")}:</Row>
      </Col>
      <Col sm={5}>
        <Row className="total-cost-content d-block text-sm-right">{t("default.currency", { value: sum })}</Row>
      </Col>
    </Row>
  </>
}

export default TotalSumCard