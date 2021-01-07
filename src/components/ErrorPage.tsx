import { Parser } from "html-to-react"
import Link from "next/link"
import { Col, Row } from "reactstrap"

import { useTranslation } from "services/i18n"
import { RequestErrors } from "services/requestError"
import { Routes } from "services/routes"
import BaseLayout from "./BaseLayout"

interface IProps {
  error?: string
  statusCode?: number
  title?: string
}

const ErrorPage: React.FC<IProps> = ({ error, statusCode, title }: IProps) => {
  const { t } = useTranslation()
  const htmlParser = new Parser()

  statusCode = statusCode || 500
  title = title || `_error:title.${statusCode}`
  error = error && error !== RequestErrors.NotFound && error !== RequestErrors.BadRequest
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
          <Link href={Routes.Home}>
            <a className="btn btn-primary" title={t("goto.home")}>{t("goto.home")}</a>
          </Link>
        </p>
      </Col>
    </Row>
  </BaseLayout>
}

export default ErrorPage
