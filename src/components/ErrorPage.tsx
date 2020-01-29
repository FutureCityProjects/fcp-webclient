import { Parser } from "html-to-react"
import Link from "next/link"
import { Col, Row } from "reactstrap"

import { useTranslation } from "services/i18n"
import { REQUEST_ERRORS } from "services/requestError"
import { Routes } from "services/routes"
import BaseLayout from "./BaseLayout"

interface IProps {
  error?: string
  statusCode?: number
  title?: string
}

function ErrorPage({ error, statusCode, title }: IProps) {
  const { t } = useTranslation()
  const htmlParser = new Parser()

  statusCode = statusCode || 500
  title = title || `_error:title.${statusCode}`
  error = error && error !== REQUEST_ERRORS.NOT_FOUND && error !== REQUEST_ERRORS.BAD_REQUEST
    ? `_error:${error}`
    : `_error:explanation.${statusCode}`

  return <BaseLayout pageTitle={t(title)}>
    <Row>
      <Col className="text-center">
        <h1>{t(title)}</h1>
        <p>
          {htmlParser.parse(t(error))}
        </p>
        <p>
          <Link href={Routes.HOME}>
            <a className="btn btn-primary" title={t("goto.home")}>{t("goto.home")}</a>
          </Link>
        </p>
      </Col>
    </Row>
  </BaseLayout>
}

export default ErrorPage
