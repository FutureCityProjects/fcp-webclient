import React from "react"
import { Card, CardBody, CardHeader, UncontrolledCollapse } from "reactstrap"

import { IProject } from "api/schema"
import Icon from "components/common/Icon"
import Link from "next/link"
import { useTranslation } from "services/i18n"
import { Routes, routeWithParams } from "services/routes"

interface IProps {
  project: IProject
}

const DataView: React.FC<IProps> = (props: IProps) => {
  const { t } = useTranslation()
  const { project } = props

  return <Card className="body-card">
    <CardHeader
      aria-expanded="false"
    >
      <div className="title-section" >
        <h3>{t("project.applicationData")}</h3>
      </div>
      <div className={"icon-navigation"}>
        <Link
          href={Routes.PROJECT_FUND_APPLICATION_EDIT}
          as={routeWithParams(Routes.PROJECT_FUND_APPLICATION_EDIT, { slug: project.slug || project.id })}
        >
          <a aria-label={t("goto.editApplicationData")} className="navigation-item" title={t("goto.editApplicationData")}>
            <Icon name={"pencil"} size={24} />
          </a>
        </Link>
        <a id={"toggler-application"}
          className="toggler navigation-item caret"
          onClick={() => document.getElementById("caret-application").classList.toggle("caret-toggled")}
        >
          <span id={"caret-application"}><Icon name="caret" size={24} /></span>
        </a>
      </div>
    </CardHeader>

    <UncontrolledCollapse toggler={"#toggler-application"}>
      <CardBody>
        <h5>{t("project.contactName")}</h5>
        <p>{project.contactName
          ? project.contactName
          : t("default.empty")}</p>

        <h5>{t("project.contactEmail")}</h5>
        <p>{project.contactEmail
          ? project.contactEmail
          : t("default.empty")}</p>

        <h5>{t("project.contactPhone")}</h5>
        <p>{project.contactPhone
          ? project.contactPhone
          : t("default.empty")}</p>

        <h5>{t("project.holderName")}</h5>
        <p>{project.holderName
          ? project.holderName
          : t("default.empty")}</p>

        <h5>{t("project.holderStreet")}</h5>
        <p>{project.holderStreet
          ? project.holderStreet
          : t("default.empty")}</p>

        <h5>{t("project.holderAddressInfo")}</h5>
        <p>{project.holderAddressInfo
          ? project.holderAddressInfo
          : t("default.empty")}</p>

        <h5>{t("project.holderZipCode")}</h5>
        <p>{project.holderZipCode
          ? project.holderZipCode
          : t("default.empty")}</p>

        <h5>{t("project.holderCity")}</h5>
        <p>{project.holderCity
          ? project.holderCity
          : t("default.empty")}</p>
      </CardBody>
    </UncontrolledCollapse>
  </Card>
}

export default DataView
