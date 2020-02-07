import { WithTranslation } from "next-i18next"
import Link from "next/link"
import React from "react"
import { Col, Row } from "reactstrap"

import BaseLayout from "components/BaseLayout"
import { I18nPage, includeDefaultNamespaces, withTranslation } from "services/i18n"

type PageProps = WithTranslation

const Page: I18nPage<PageProps> = () => {
  return (
    <BaseLayout pageTitle="Demo" >
      <Row>
        <Col>
          <h1>Demo-Inhalte</h1>
          <p>
            Links zu statischen Seiten um die einzelnen Komponenten zu demonstrieren/stylen
            ohne Login oder Realdaten zu benötigen
        </p>
          <ul>
            <li>
              <Link href="/demo/toasts">
                <a>Toasts</a>
              </Link>
            </li>
            <li>
              <Link href="/demo/myprojects">
                <a>Meine Projekte, statisch</a>
              </Link>
            </li>
            <li>
              <Link href="/demo/profile">
                <a>Projektprofil, statisch</a>
              </Link>
            </li>
            <li>
              <Link href="/demo/profile-form">
                <a>Projektprofil Formular</a>
              </Link>
            </li>
            <li>
              <Link href="/demo/market">
                <a>Marktplatz, statisch</a>
              </Link>
            </li>
            <li>
              <Link href="/demo/tasks">
                <a>Aufgabenverwaltung</a>
              </Link>
            </li>
            <li>
              <Link href="/demo/work-packages">
                <a>Arbeitspakete</a>
              </Link>
            </li>
            <li>
              <Link href="/demo/icons">
                <a>alle Icons</a>
              </Link>
            </li>
          </ul>
        </Col>
      </Row>
    </BaseLayout>
  )
}

Page.getInitialProps = async () => {
  return {
    namespacesRequired: includeDefaultNamespaces(),
  }
}

export default withTranslation(includeDefaultNamespaces())(Page)
