import React from "react"
import { Card, CardHeader } from "reactstrap"

import { useTranslation } from "services/i18n"

const NoWorkPackages: React.FC = () => {
  const { t } = useTranslation()
  return <Card className="work-package-card no-work-packages">
    <CardHeader>{t("page.projects.plan.workPackages.noPackages")}</CardHeader>
  </Card>
}

export default NoWorkPackages
