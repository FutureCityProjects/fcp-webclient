import { WithTranslation } from "next-i18next"
import Link from "next/link"
import React from "react"
import { Button } from "reactstrap"

import BaseLayout from "components/BaseLayout"
import TranslatedHtml from "components/common/TranslatedHtml"
import { I18nPage, includeDefaultNamespaces, withTranslation } from "services/i18n"
import { Routes } from "services/routes"

type PageProps = WithTranslation

const FrontPage: I18nPage<PageProps> = ({ t }: PageProps) => {
  return <BaseLayout pageTitle={t("page.index.title")} isFrontPage={true}>
    <div className="home-content">
      <h1 role="heading" aria-level={2} className="title">{t("page.index.heading")}</h1>
      <span aria-label="quote" className="quote">
        <TranslatedHtml content={t("page.index.quote")} />
      </span>

      <Link href={Routes.MARKETPLACE}>
        <Button aria-label="marketplace" color="dark">
          <span className="button-title">{t("page.index.buttonTitle")}</span>
          {t("page.index.button")}
        </Button>
      </Link>
    </div>
  </BaseLayout>
}

FrontPage.getInitialProps = async () => ({
  namespacesRequired: includeDefaultNamespaces(),
})

export default withTranslation(includeDefaultNamespaces())(FrontPage)
