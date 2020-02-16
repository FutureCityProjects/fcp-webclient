import { WithTranslation } from "next-i18next"
import React from "react"
import { Col, Row } from "reactstrap"

import BaseLayout from "components/BaseLayout"
import TranslatedHtml from "components/common/TranslatedHtml"
import { I18nPage, includeDefaultNamespaces, withTranslation } from "services/i18n"

const TeamToolPage: I18nPage<WithTranslation> = ({ t }) => {
  return <BaseLayout pageTitle={t("page.offlineTools.profile.title")}>
    <Row>
      <Col>
        <h1>{t("page.offlineTools.profile.heading")}</h1>
        <p><TranslatedHtml content="page.offlineTools.profile.intro" /></p>
      </Col>
    </Row>
  </BaseLayout>
}

TeamToolPage.getInitialProps = async () => ({
  namespacesRequired: includeDefaultNamespaces(),
})

export default withTranslation(includeDefaultNamespaces())(TeamToolPage)
