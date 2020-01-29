import React from "react"
import { Card, CardBody, CardHeader } from "reactstrap"

import { useTranslation } from "services/i18n"

const EmptyProjectCard: React.FC = () => {
  const { t } = useTranslation()

  return <Card className="marketplace-card empty-card">
    <CardHeader>
      <h3>{t("page.projects.index.newProject.header")}</h3>
    </CardHeader>

    <CardBody>
      {t("page.projects.index.newProject.body")}
    </CardBody>
  </Card>
}

export default EmptyProjectCard
