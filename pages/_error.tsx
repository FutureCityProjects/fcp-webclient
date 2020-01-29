import { WithTranslation } from "next-i18next"
import React from "react"

import ErrorPage from "components/ErrorPage"
import { I18nPage, includeDefaultNamespaces, withTranslation } from "services/i18n"

interface IProps extends WithTranslation {
  error?: string
  statusCode: number
}

const DefaultErrorPage: I18nPage<IProps> = ({ error, statusCode }) =>
  <ErrorPage statusCode={statusCode} error={error} />

DefaultErrorPage.getInitialProps = ({ res, err }) => {
  const statusCode = res ? res.statusCode : err ? err.statusCode : 404
  const error = err ? err.message : null

  return {
    error,
    namespacesRequired: includeDefaultNamespaces(),
    statusCode,
  }
}

export default withTranslation(includeDefaultNamespaces())(DefaultErrorPage)
