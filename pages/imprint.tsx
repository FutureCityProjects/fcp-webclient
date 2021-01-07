import { WithTranslation } from "next-i18next"
import React from "react"
import { Col, Row } from "reactstrap"

import BaseLayout from "components/BaseLayout"
import TranslatedHtml from "components/common/TranslatedHtml"
import { I18nPage, includeDefaultNamespaces, withTranslation } from "services/i18n"

const ImprintPage: I18nPage<WithTranslation> = ({ t }) => {
  return <BaseLayout pageTitle={t("page.imprint.title")}>
    <Row>
      <Col>
        <h1>{t("page.imprint.heading")}</h1>
        <p><TranslatedHtml content="page.imprint.intro" /></p>
      </Col>
    </Row>
  </BaseLayout>
}

ImprintPage.getInitialProps = () => ({
  namespacesRequired: includeDefaultNamespaces(),
})

export default withTranslation(includeDefaultNamespaces())(ImprintPage)
