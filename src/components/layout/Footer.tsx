import React from "react"
import { Col, Row } from "reactstrap"

import Link from "next/link"
import { useTranslation } from "services/i18n"
import { Routes } from "services/routes"
import SocialLinks from "./SocialLinks"

interface IProps {
  isFrontPage?: boolean
}

const Footer: React.FC<IProps> = (props: IProps) => {
  const { t } = useTranslation()

  return <footer>
    <Row className="footer-content">
      <Col>
        {props.isFrontPage && <SocialLinks />}
      </Col>
      <Col className="footer-links">
        <Link href={Routes.about} >
          <a title={t("goto.about")}>{t("navigation.about")}</a>
        </Link> | <Link href={Routes.imprint} >
          <a>{t("navigation.imprint")}</a>
        </Link> | <Link href={Routes.dataProtection} >
          <a>{t("navigation.dataProtection")}</a>
        </Link>
      </Col>
      <Col></Col>
    </Row>
    {process.env.LAST_COMMIT &&
      <Row className="footer-content">
        <Col className="footer-links text-right">
          <small>
            <a href={"https://github.com/FutureCityProjects/fcp-webclient/commit/" + process.env.LAST_COMMIT.trim()} target="_blank">
              Github ({process.env.LAST_COMMIT.trim().substr(0, 7)})
            </a>
          </small>
        </Col>
      </Row>
    }
  </footer>
}

export default Footer
