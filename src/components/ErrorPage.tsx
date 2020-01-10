import { WithTranslation } from "next-i18next"
import Link from "next/link"
import { Col, Row } from "reactstrap"

import { withTranslation } from "services/i18n"
import { REQUEST_ERRORS } from "services/requestError"
import Layout from "./Layout"

interface IProps extends WithTranslation {
  error?: string
  statusCode?: number
  title?: string
}

function ErrorPage({ error, statusCode, t, title }: IProps) {
  statusCode = statusCode || 500
  title = title || `_error:title.${statusCode}`
  error = error && error !== REQUEST_ERRORS.NOT_FOUND && error !== REQUEST_ERRORS.BAD_REQUEST
    ? error
    : `_error:explanation.${statusCode}`

  return <Layout title={t(title)}>
    <Row>
      <Col>
        <h1>{t(title)}</h1>
        <p>
          {/* @todo use DOMPurify?
          https://medium.com/@abookone/how-to-translate-partial-html-content-with-dangerouslysetinnerhtml-and-react-i18next-8a3f10ec7a65
          */}
          <div dangerouslySetInnerHTML={{ __html: t(error) }}></div>
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
