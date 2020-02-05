import { WithTranslation } from "next-i18next"
import React from "react"
import { Col, Row } from "reactstrap"

import BaseLayout from "components/BaseLayout"
import TranslatedHtml from "components/common/TranslatedHtml"
import { I18nPage, includeDefaultNamespaces, withTranslation } from "services/i18n"

const DataProtectionPage: I18nPage<WithTranslation> = ({ t }) => {
  return <BaseLayout pageTitle={t("page.dataProtection.title")}>
    <Row>
      <Col>
        <h1>{t("page.dataProtection.heading")}</h1>
        <p><TranslatedHtml content="page.dataProtection.intro" /></p>
      </Col>
    </Row>
  </BaseLayout>
}

DataProtectionPage.getInitialProps = async () => ({
  namespacesRequired: includeDefaultNamespaces(),
})

export default withTranslation(includeDefaultNamespaces())(DataProtectionPage)
