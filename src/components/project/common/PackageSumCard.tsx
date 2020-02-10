import { Col, Row } from "reactstrap"

import { IWorkPackage } from "api/schema"
import { IPlanFunctions } from "components/project/common/PlanContainer"
import { useTranslation } from "services/i18n"

interface IProps {
  currentPackage: IWorkPackage
  functions: IPlanFunctions
  showFinances?: boolean
}

const PackageSumCard: React.FC<IProps> = (props: IProps) => {
  const { t } = useTranslation()
  const { currentPackage, functions, showFinances = false } = props

  const resourceRequirements = functions.getWorkPackageResourceRequirements(currentPackage.id)
  const sum = functions.sumResourceRequirementCosts(resourceRequirements)

  return <Row className="package-sum">
    <Col md={showFinances ? 9 : 8} className="package-cost-description">
      <Row className="d-block text-md-right">{t("project.resourceRequirement.packageSum")}:</Row>
    </Col>
    <Col md={showFinances ? 3 : 4} className="package-cost-content">
      <Row className="text-md-right d-block">{t("default.currency", { value: sum })}</Row>
    </Col>
  </Row>
}

export default PackageSumCard