import { Col, Row } from "reactstrap"

import { IProject } from "api/schema"
import { IPlanFunctions } from "components/project/common/PlanContainer"
import { useTranslation } from "services/i18n"

interface IProps {
  currentTask: string
  functions: IPlanFunctions
  project: IProject
}

const TaskSumCard: React.FC<IProps> = (props: IProps) => {
  const { t } = useTranslation()
  const { currentTask, functions } = props

  const resourceRequirements = functions.getTaskResourceRequirements(currentTask)
  const sum = functions.sumResourceRequirementCosts(resourceRequirements)

  return <Row className="resource-card show-grid">
    <Col md={8} className="resource-description">
      <Row className="resource-description-content d-none d-lg-block text-right">{t("project.resourceRequirements.costSum")}:</Row>
      <Row className="resource-description-label d-block d-lg-none"><h5>{t("project.resourceRequirements.costSum")}</h5></Row>
    </Col>
    <Col md={4} className="resource-cost">
      <Row className="resource-cost-content text-right">{t("default.currency", { value: sum })}</Row>
    </Col>
  </Row>
}

export default TaskSumCard