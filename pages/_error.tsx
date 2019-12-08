import { WithTranslation } from "next-i18next"
import Head from "next/head"
import React from "react"

import ErrorPage from "components/ErrorPage"
import { I18nPage, includeDefaultNamespaces, withTranslation } from "services/i18n"

interface IProps extends WithTranslation {
  error?: string
  statusCode: number
}

const Page: I18nPage<IProps> = ({ error, statusCode, t }) => {
  return <>
    <Head>
      <title>{t("_error:title")}</title>
    </Head>
    <ErrorPage statusCode={statusCode} error={error} />
  </>
}

Page.getInitialProps = ({ res, err }) => {
  const statusCode = res ? res.statusCode : err ? err.statusCode : 404
  const error = err ? err.message : null

  return {
    error,
    namespacesRequired: includeDefaultNamespaces(),
    statusCode,
  }
}

export default withTranslation("common")(Page)
