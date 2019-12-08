import { WithTranslation } from "next-i18next"
import Link from "next/link"

import { Col, Row } from "reactstrap"
import { withTranslation } from "services/i18n"
import { Trans } from "../../config/i18n"
import Layout from "./Layout"

interface IProps extends WithTranslation {
  error?: string
  statusCode?: number
  title?: string
}

function ErrorPage({ error, statusCode, t, title }: IProps) {
  statusCode = statusCode || 500
  title = title || `_error:title.${statusCode}`
  error = error || `_error:explanation.${statusCode}`

  return <Layout title={t(title)}>
    <Row>
      <Col>
        <h1>{t(title)}</h1>
        <p>
          <Trans i18nKey={error}>
            <a href="mailto:admin@zukunftsstadt.de"></a>
          </Trans>
        </p>
        <p>
          <Link href="/">
            <a>{t("goto.home")}</a>
          </Link>
        </p>
      </Col>
    </Row>
  </Layout >
}

export default withTranslation(["common"])(ErrorPage)
