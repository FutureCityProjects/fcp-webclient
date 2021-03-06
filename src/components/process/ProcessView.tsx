import React from "react"
import { Card, CardBody, CardHeader } from "reactstrap"

import { FundState, IProcess, UserRole } from "api/schema"
import AuthElement from "components/common/AuthElement"
import HtmlContent from "components/common/HtmlContent"
import Icon from "components/common/Icon"
import TranslatedHtml from "components/common/TranslatedHtml"
import Link from "next/link"
import { useTranslation } from "services/i18n"
import { Routes, routeWithParams } from "services/routes"

interface IProps {
  process: IProcess
  roles: UserRole[]
}

const ProcessView: React.FC<IProps> = ({ process, roles }: IProps) => {
  const { t } = useTranslation()

  return <>
    <Card>
      <CardHeader>{process.name}
        <AuthElement requiredRole={UserRole.ProcessOwner} roles={roles}>
          <div role="actions" className="icon-navigation">
            <Link href={Routes.ProcessEdit} /* as={routeWithParams(Routes.PROCESS_EDIT, {id: process.id})}*/>
              <a aria-label={t("goto.editProcess")} className="navigation-item" title={t("goto.editProcess")}>
                <Icon name={"pencil"} size={24} />
              </a>
            </Link>
          </div>
        </AuthElement>
      </CardHeader>
      <CardBody>
        <div className="rte-content"><HtmlContent content={process.description} /></div>

        <h5>{t("process.region")}</h5>
        {process.region}

        <h5>{t("process.goals")}</h5>
        {process.goals && process.goals.length
          ? <ul>
            {process.goals.map((goal, index) => <li key={index}>{goal}</li>)}
          </ul>
          : t("default.empty")
        }

        <h5>{t("process.criteria")}</h5>
        {process.criteria && process.criteria.length
          ? <ul>
            {process.criteria.map((criteria, index) => <li key={index}>{criteria}</li>)}
          </ul>
          : t("default.empty")
        }
      </CardBody>
    </Card>
    <Card>
      <CardHeader>
        <h3>{t("process.imprint")}</h3>
      </CardHeader>
      <CardBody>
        <TranslatedHtml content={process.imprint} />
      </CardBody>
    </Card>

    <Card>
      <CardHeader>
        <h3>{t("process.funds")}</h3>
        <AuthElement requiredRole={UserRole.ProcessOwner} roles={roles}>
          <div role="actions" className="icon-navigation">
            <Link href={Routes.FundOverview}>
              <a aria-label={t("goto.fundManagement")} className="navigation-item" title={t("goto.fundManagement")}>
                <Icon name={"pot"} size={24} />
              </a>
            </Link>
          </div>
        </AuthElement>
      </CardHeader>
      <CardBody>
        <p>{t("page.process.index.fundsHelp")}</p>

        {process.funds.filter((fund) => fund.state !== FundState.Inactive).map((fund) => {
          const stateText = fund.state === FundState.Active
            ? <span className="text-success">aktiv</span>
            : (fund.state === FundState.Finished
              ? <span className="text-muted">abgeschlossen</span>
              : <span className="text-warning">inaktiv</span>
            )
          return <div key={"fund-" + fund.id.toString()}>
            <h5>
              <Link href={Routes.FundPage} as={routeWithParams(Routes.FundPage, { slug: fund.slug || fund.id })}>
                <a aria-label={t("goto.fundDetails")} title={t("goto.fundDetails")}>
                  {fund.name}
                </a>
              </Link>
            </h5>
            <p>{stateText}</p>
          </div>
        })}
      </CardBody>
    </Card>
  </>
}

export default ProcessView