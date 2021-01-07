import { NextPageContext } from "next"
import { WithTranslation } from "next-i18next"
import Router from "next/router"
import React from "react"
import { connect, ConnectedProps } from "react-redux"
import { Col, Row, Spinner } from "reactstrap"
import { AnyAction, Dispatch } from "redux"

import { normalizeFund } from "api/helper"
import { IFund, UserRole } from "api/schema"
import BaseLayout from "components/BaseLayout"
import StatusCode from "components/common/StatusCode"
import TranslatedHtml from "components/common/TranslatedHtml"
import ErrorPage from "components/ErrorPage"
import FundForm from "components/fund/FundForm"
import { withAuth } from "components/hoc/withAuth"
import { loadCollectionAction, updateModelAction } from "redux/helper/actions"
import { AppState } from "redux/reducer"
import { EntityType, selectById } from "redux/reducer/data"
import { selectManagementFundsLoaded } from "redux/reducer/fundManagement"
import { I18nPage, includeDefaultNamespaces, withTranslation } from "services/i18n"
import { Routes, routeWithParams } from "services/routes"

const mapDispatchToProps = (dispatch: Dispatch<AnyAction>) => ({
  updateFund: (fund, actions) =>
    dispatch(updateModelAction(EntityType.FUND, fund, actions)),
})

const mapStateToProps = (state: AppState, { id }) => ({
  // @todo don't select any fund, only if it was loaded with PO privileges
  fund: selectById<IFund>(state, EntityType.FUND, id),

  request: state.requests.fundsLoading,
})

const connector = connect(mapStateToProps, mapDispatchToProps)
type PageProps = ConnectedProps<typeof connector> & WithTranslation & {
  id: number
}

const fundEditPage: I18nPage<PageProps> = ({ fund, request, t, updateFund }) => {
  // @todo custom error message "fund not found" etc.
  if (!request.isLoading && !fund) {
    return <StatusCode statusCode={404}>
      <ErrorPage statusCode={404} error={request.loadingError} />
    </StatusCode>
  }

  const onSubmit = (values, actions) => {
    actions.success = () => {
      Router.push(Routes.fundDetails,
        routeWithParams(Routes.fundDetails, { id: fund.id }))
    }

    updateFund(normalizeFund(values), actions)
  }

  return <BaseLayout pageTitle={t("page.management.funds.edit.title")}>
    <Row>
      <Col>
        <h1>{t("page.management.funds.edit.heading")}</h1>
        <p><TranslatedHtml content="page.management.funds.edit.intro" /></p>
      </Col>
    </Row>

    <Row>
      <Col>
        {request.isLoading ? <Spinner /> :
          <FundForm onSubmit={onSubmit} fund={fund} />
        }
      </Col>
    </Row>
  </BaseLayout>
}

fundEditPage.getInitialProps = ({ store, query }: NextPageContext) => {
  let id: number = null
  if (typeof query.id === "string" && /^\d+$/.exec(query.id)) {
    id = parseInt(query.id, 10)

    // @todo we load all funds here, otherwise we would need to keep track if the single
    // requested fund was loaded with PO privileges or was in store from any logged out
    // actions etc. - refactor the reducer to track a single fund for PO management
    if (!selectManagementFundsLoaded(store.getState())) {
      store.dispatch(loadCollectionAction(EntityType.FUND, {}, "fund_management"))
    }
  }

  return { id, namespacesRequired: includeDefaultNamespaces() }
}

export default withAuth(
  connector(
    withTranslation(includeDefaultNamespaces())(fundEditPage),
  ),
  UserRole.PROCESS_OWNER,
)
