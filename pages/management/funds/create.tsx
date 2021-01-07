import { WithTranslation } from "next-i18next"
import Router from "next/router"
import React from "react"
import { connect, ConnectedProps } from "react-redux"
import { Col, Row } from "reactstrap"
import { AnyAction, Dispatch } from "redux"

import { normalizeFund } from "api/helper"
import { IFund, UserRole } from "api/schema"
import BaseLayout from "components/BaseLayout"
import TranslatedHtml from "components/common/TranslatedHtml"
import FundForm from "components/fund/FundForm"
import { withAuth } from "components/hoc/withAuth"
import { createModelAction } from "redux/helper/actions"
import { EntityType } from "redux/reducer/data"
import { I18nPage, includeDefaultNamespaces, withTranslation } from "services/i18n"
import { Routes, routeWithParams } from "services/routes"

const mapDispatchToProps = (dispatch: Dispatch<AnyAction>) => ({
  onSubmit: (fund: IFund, actions) => {
    actions.success = (result) => {
      Router.push(Routes.fundDetails, routeWithParams(Routes.fundDetails, { id: result.id }))
    }

    dispatch(createModelAction(EntityType.FUND, normalizeFund(fund), actions))
  },
})

const connector = connect(null, mapDispatchToProps)
type PageProps = ConnectedProps<typeof connector> & WithTranslation

const FundCreationPage: I18nPage<PageProps> = ({ onSubmit, t }) => {
  return <BaseLayout pageTitle={t("page.management.funds.create.title")}>
    <Row>
      <Col>
        <h1>{t("page.management.funds.create.heading")}</h1>
        <p><TranslatedHtml content="page.management.funds.create.intro" /></p>

        <FundForm onSubmit={onSubmit} />
      </Col>
    </Row>
  </BaseLayout>
}

FundCreationPage.getInitialProps = () => {
  return { namespacesRequired: includeDefaultNamespaces() }
}

export default withAuth(
  connector(
    withTranslation(includeDefaultNamespaces())(FundCreationPage),
  ),
  UserRole.PROCESS_OWNER,
)
