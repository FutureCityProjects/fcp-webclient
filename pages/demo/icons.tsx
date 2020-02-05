import { WithTranslation } from "next-i18next"
import React from "react"
import { Col, Row } from "reactstrap"

import BaseLayout from "components/BaseLayout"
import Icon, { Icons } from "components/common/Icon"
import { I18nPage, includeDefaultNamespaces, withTranslation } from "services/i18n"

type PageProps = WithTranslation

const Page: I18nPage<PageProps> = () => {
  const icons = []

  Icons.forEach(icon => {
    icons.push(<li key={Icons.indexOf(icon)}>{icon}: <Icon name={icon} size={40} /></li>)
  })

  return (
    <BaseLayout pageTitle="Icons" >
      <Row>
        <Col>
          Farbig zum Test ob alle Icons die Farbe übernehmen:
          <ul className="text-info">
            {icons}
          </ul>
        </Col>
      </Row>
    </BaseLayout>
  )
}

export default withTranslation(includeDefaultNamespaces())(Page)
