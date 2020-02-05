import React from "react"
import { Card, CardBody, CardHeader } from "reactstrap"

import { IProcess } from "api/schema"
import Icon from "components/common/Icon"
import TranslatedHtml from "components/common/TranslatedHtml"
import Link from "next/link"
import { useTranslation } from "services/i18n"
import { Routes } from "services/routes"

interface IProps {
  process: IProcess
}

export default function ProcessView({ process }: IProps) {
  const { t } = useTranslation()

  return <Card>
    <CardHeader>{t("process.name")}: {process.name}
      <div role="actions" className="icon-navigation">
        <Link href={Routes.PROCESS_EDIT} /*as={routeWithParams(Routes.PROCESS_EDIT, {id: process.id})}*/>
          <a aria-label={t("goto.editProcess")} className="navigation-item" title={t("goto.editProcess")}>
            <Icon name={"pencil"} size={24} />
          </a>
        </Link>
      </div>
    </CardHeader>
    <CardBody>
      <h5>{t("process.description")}</h5>
      <TranslatedHtml content={process.description} />

      <h5>{t("process.region")}</h5>
      <p>{process.region}</p>

      <h5>{t("process.goals")}</h5>
      {process.goals && process.goals.length
        ? <ul>
          {process.goals.map((goal, index) => <li key={index}>{goal}</li>)}
        </ul>
        : <p>{t("default.empty")}</p>
      }

      <h5>{t("process.criteria")}</h5>
      {process.criteria && process.criteria.length
        ? <ul>
          {process.criteria.map((criteria, index) => <li key={index}>{criteria}</li>)}
        </ul>
        : <p>{t("default.empty")}</p>
      }

      <h5>{t("process.imprint")}</h5>
      <TranslatedHtml content={process.imprint} />
    </CardBody>
  </Card>
}
