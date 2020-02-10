import { Col, Row } from "reactstrap"

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

  return <Row className="total-sum">
    <Col md={showFinances ? 7 : 7} className="resource-description">
      <Row className="total-cost-description d-block text-md-right">{t("project.resourceRequirement.totalSum")}:</Row>
    </Col>
    <Col md={showFinances ? 5 : 5} className="resource-cost">
      <Row className="total-cost-content d-block text-md-right">{t("default.currency", { value: sum })}</Row>
    </Col>
  </Row>
}

export default TotalSumCard