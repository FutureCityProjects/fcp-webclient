import { WithTranslation } from "next-i18next"
import React from "react"

import Layout from "components/Layout"
import { withTranslation } from "services/i18n"
import { includeDefaultNamespaces } from "services/i18n"

interface IProps extends WithTranslation {
  message: string
}

function Page({ t }: IProps) {
  return <Layout title="start">
    <p>{t("h1")}</p>
  </Layout>
}

Page.getInitialProps = async () => {
  const message = "Something unexpected happened!"

  return {
    message,
    namespacesRequired: includeDefaultNamespaces(),
  }
}

export default withTranslation("common")(Page)
