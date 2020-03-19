import { NextPageContext } from "next"
import { WithTranslation } from "next-i18next"
import Router from "next/router"
import React from "react"
import { connect, ConnectedProps } from "react-redux"
import { Card, CardBody, CardHeader, Col, Row, Spinner } from "reactstrap"
import { AnyAction, Dispatch } from "redux"

import { IFund, IFundConcretization, UserRole } from "api/schema"
import BaseLayout from "components/BaseLayout"
import StatusCode from "components/common/StatusCode"
import TranslatedHtml from "components/common/TranslatedHtml"
import ErrorPage from "components/ErrorPage"
import ConcretizationForm from "components/fund/ConcretizationForm"
import { withAuth } from "components/hoc/withAuth"
import { createModelAction, loadCollectionAction } from "redux/helper/actions"
import { AppState } from "redux/reducer"
import { EntityType, selectById } from "redux/reducer/data"
import { selectManagementFundsLoaded } from "redux/reducer/fundManagement"
import { I18nPage, includeDefaultNamespaces, withTranslation } from "services/i18n"
import { Routes, routeWithParams } from "services/routes"

const mapDispatchToProps = (dispatch: Dispatch<AnyAction>) => ({
  createConcretization: (concretization, actions) =>
    dispatch(createModelAction(EntityType.FUND_CONCRETIZATION, concretization, actions)),
})

const mapStateToProps = (state: AppState, { id }) => ({
  // @todo don't select any fund, only if it was loaded with PO privileges
  fund: selectById<IFund>(state, EntityType.FUND, id),

  request: state.requests.fundsLoading,
})

const connector = connect(mapStateToProps, mapDispatchToProps)
type PageProps = ConnectedProps<typeof connector> & WithTranslation & {
  id: number,
}

const ConcretizationCreationPage: I18nPage<PageProps> = ({ fund, request, t, createConcretization }) => {
  // @todo custom error message "fund not found" etc.
  if (!request.isLoading && !fund) {
    return <StatusCode statusCode={404}>
      <ErrorPage statusCode={404} error={request.loadingError} />
    </StatusCode>
  }

  const onSubmit = (values: IFundConcretization, actions) => {
    actions.success = () => {
      Router.push(Routes.FUND_DETAILS,
        routeWithParams(Routes.FUND_DETAILS, { id: fund.id }) + "#concretizations")
    }

    values.fund = fund["@id"]
    createConcretization(values, actions)
  }

  return <BaseLayout pageTitle={t("page.management.funds.addConcretization.title")}>
    <Row>
      <Col>
        <h1>{t("page.management.funds.addConcretization.heading")}</h1>
        <p><TranslatedHtml content="page.management.funds.addConcretization.intro" /></p>
      </Col>
    </Row>

    <Row>
      <Col>
        {request.isLoading ? <Spinner /> :
          <Card>
            <CardHeader>{t("form.fundConcretization.header")}</CardHeader>
            <CardBody>
              <ConcretizationForm onSubmit={onSubmit} />
            </CardBody>
          </Card>
        }
      </Col>
    </Row>
  </BaseLayout>
}

ConcretizationCreationPage.getInitialProps = ({ store, query }: NextPageContext) => {
  let id: number = null
  if (typeof query.id === "string" && query.id.match(/^\d+$/)) {
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
    withTranslation(includeDefaultNamespaces())(ConcretizationCreationPage),
  ),
  UserRole.PROCESS_OWNER,
)
