import React from "react"
import { Card, CardBody, CardHeader } from "reactstrap"

import { IProject } from "api/schema"
import { useTranslation } from "services/i18n"
import SelfAssessmentForm from "./SelfAssessmentForm"

interface IProps {
  onSubmit: any
  project: IProject
}

const SelfAssessment: React.FC<IProps> = (props: IProps) => {
  const { t } = useTranslation()
  const { onSubmit, project } = props

  return <Card className="body-card">
    <CardHeader>
      <h3>{t("project.planSelfAssessment")}</h3>
    </CardHeader>
    <CardBody>
      <SelfAssessmentForm project={project} onSubmit={onSubmit} />
    </CardBody>
  </Card >
}

export default SelfAssessment
