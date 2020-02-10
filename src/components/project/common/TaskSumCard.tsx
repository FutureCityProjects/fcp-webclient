import { Col, Row } from "reactstrap"

import { IProjectTask } from "api/schema"
import { IPlanFunctions } from "components/project/common/PlanContainer"
import { useTranslation } from "services/i18n"

interface IProps {
  currentTask: IProjectTask
  functions: IPlanFunctions
  showFinances?: boolean
}

const TaskSumCard: React.FC<IProps> = (props: IProps) => {
  const { t } = useTranslation()
  const { currentTask, functions, showFinances = false } = props

  const resourceRequirements = functions.getTaskResourceRequirements(currentTask.id)
  const sum = functions.sumResourceRequirementCosts(resourceRequirements)

  return <>
    <Col md={showFinances ? 4 : 8} className="task-cost-description">
      <Row className="resource-description-content d-block text-md-right">{t("project.resourceRequirement.taskSum")}:</Row>
    </Col>
    <Col md={showFinances ? 3 : 4} className="task-cost-content">
      <Row className="resource-cost-content text-md-right d-block">{t("default.currency", { value: sum })}</Row>
    </Col>
  </>
}

export default TaskSumCard