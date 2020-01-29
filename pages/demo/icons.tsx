import { WithTranslation } from "next-i18next"
import React from "react"
import { Col, Row } from "reactstrap"

import BaseLayout from "components/BaseLayout"
import { Icons } from "components/Icon"
import { I18nPage, includeDefaultNamespaces, withTranslation } from "services/i18n"

type PageProps = WithTranslation

const Page: I18nPage<PageProps> = () => {
  const icons = []
  for (const key in Icons) {
    if (Icons.hasOwnProperty(key)) {
      const Comp = Icons[key].default
      icons.push(<li key={key}>{key}: <Comp size={40} /></li>)
    }
  }
  return (
    <BaseLayout pageTitle="Icons" >
      <Row>
        <Col>
          <ul>
            {icons}
          </ul>
        </Col>
      </Row>
    </BaseLayout>
  )
}

export default withTranslation(includeDefaultNamespaces())(Page)
