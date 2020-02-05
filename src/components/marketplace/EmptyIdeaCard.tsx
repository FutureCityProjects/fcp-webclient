import Link from "next/link"
import React from "react"
import { Button, Card, CardBody, CardHeader } from "reactstrap"

import { useTranslation } from "services/i18n"
import { Routes } from "services/routes"

const EmptyIdeaCard: React.FC = () => {
  const { t } = useTranslation()

  return <Card className="marketplace-card empty-card">
    <CardHeader>
      <h3>{t("page.projects.index.newIdea.header")}</h3>
    </CardHeader>

    <CardBody>
      <Link href={Routes.CREATE_IDEA}>
        <Button color="primary">
          <span className="button-title">{t("goto.newIdea")}</span>
        </Button>
      </Link>
    </CardBody>
  </Card>
}

export default EmptyIdeaCard
