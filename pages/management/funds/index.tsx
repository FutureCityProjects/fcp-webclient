import { NextPageContext } from "next"
import { WithTranslation } from "next-i18next"
import Link from "next/link"
import React from "react"
import { connect, ConnectedProps } from "react-redux"
import { Button, Col, Row, Spinner } from "reactstrap"

import { IFund, UserRole } from "api/schema"
import BaseLayout from "components/BaseLayout"
import PageError from "components/common/PageError"
import TranslatedHtml from "components/common/TranslatedHtml"
import FundManagementCard from "components/fund/FundManagementCard"
import { withAuth } from "components/hoc/withAuth"
import { loadCollectionAction } from "redux/helper/actions"
import { AppState } from "redux/reducer"
import { EntityType } from "redux/reducer/data"
import { selectManagementFunds, selectManagementFundsLoaded } from "redux/reducer/fundManagement"
import { I18nPage, includeDefaultNamespaces, withTranslation } from "services/i18n"
import { Routes } from "services/routes"

const mapStateToProps = (state: AppState) => ({
  funds: selectManagementFunds(state),
  request: state.requests.fundsLoading,
})

const connector = connect(mapStateToProps)
type PageProps = ConnectedProps<typeof connector> & WithTranslation

const FundManagementPage: I18nPage<PageProps> = ({ funds, request, t }) => {
  return <BaseLayout pageTitle={t("page.management.funds.index.title")}>
    <Row>
      <Col>
        <h1>{t("page.management.funds.index.heading")}</h1>
        <p><TranslatedHtml content="page.management.funds.index.intro" /></p>

        <Link href={Routes.fundCreate}>
          <Button color="primary">{t("goto.createFund")}</Button>
        </Link>

        <PageError error={request.loadingError} />

        {request.isLoading
          ? <Spinner />
          : <>
            {!funds.length && <p>{t("page.management.funds.index.noFunds")}</p>}

            {funds.map((fund: IFund) => <FundManagementCard fund={fund} key={fund.id} />)}
          </>
        }
      </Col>
    </Row>
  </BaseLayout>
}

FundManagementPage.getInitialProps = async ({ store }: NextPageContext) => {
  if (!selectManagementFundsLoaded(store.getState())) {
    store.dispatch(loadCollectionAction(EntityType.FUND, {}, "fund_management"))
  }

  return { namespacesRequired: includeDefaultNamespaces() }
}

export default withAuth(
  connector(
    withTranslation(includeDefaultNamespaces())(FundManagementPage),
  ),
  UserRole.PROCESS_OWNER,
)
