import { WithTranslation } from "next-i18next"
import Link from "next/link"
import React from "react"
import { Button } from "reactstrap"

import BaseLayout from "components/BaseLayout"
import { I18nPage, includeDefaultNamespaces, withTranslation } from "services/i18n"
import { Routes } from "services/routes"

type PageProps = WithTranslation

const FrontPage: I18nPage<PageProps> = () => {
  return <BaseLayout pageTitle="Home" isFrontPage={true}>
    <div className="home-content">
      <h1 role="heading" aria-level={2} className="title">Gemeinsam Dresden nachhaltig gestalten</h1>
      <span aria-label="quote" className="quote">"Deine Plattform für nachhaltige Stadtentwicklung"</span>

      <Link href={Routes.MARKETPLACE}>
        <Button aria-label="marketplace" color="dark">
          <span className="button-title">zum Marktplatz</span>
          Hier findest du alle Ideen und laufende Projekte
        </Button>
      </Link>
    </div>
  </BaseLayout>
}

FrontPage.getInitialProps = async () => ({
  namespacesRequired: includeDefaultNamespaces(),
})

export default withTranslation(includeDefaultNamespaces())(FrontPage)
