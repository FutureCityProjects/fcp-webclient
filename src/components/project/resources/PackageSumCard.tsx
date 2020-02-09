import { Col, Row } from "reactstrap"

import { IProject } from "api/schema"
import { IPlanFunctions } from "components/project/common/PlanContainer"
import { useTranslation } from "services/i18n"

interface IProps {
  currentPackage: string
  functions: IPlanFunctions
  project: IProject
}

const PackageSumCard: React.FC<IProps> = (props: IProps) => {
  const { t } = useTranslation()
  const { currentPackage, functions } = props

  const resourceRequirements = functions.getWorkPackageResourceRequirements(currentPackage)
  const sum = functions.sumResourceRequirementCosts(resourceRequirements)

  if (sum === 0) {
    return null
  }

  return <Row className="resource-card show-grid">
    <Col lg={8} className="resource-description">
      <Row className="resource-description-content d-none d-lg-block text-right">{t("project.workPackages.costSum")}:</Row>
      <Row className="resource-description-label d-block d-lg-none"><h5>{t("project.workPackages.costSum")}</h5></Row>
    </Col>
    <Col lg={4} className="resource-cost">
      <Row className="resource-cost-content text-right">{t("default.currency", { value: sum })}</Row>
    </Col>
  </Row>
}

export default PackageSumCard