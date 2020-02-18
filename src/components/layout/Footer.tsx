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
        <Link href={Routes.ABOUT} >
          <a title={t("goto.about")}>{t("navigation.about")}</a>
        </Link> | <Link href={Routes.IMPRINT} >
          <a>{t("navigation.imprint")}</a>
        </Link> | <Link href={Routes.DATA_PROTECTION} >
          <a>{t("navigation.dataProtection")}</a>
        </Link>
      </Col>
      <Col></Col>
    </Row>
  </footer>
}

export default Footer
