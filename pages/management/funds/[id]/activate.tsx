import { NextPageContext } from "next"
import { WithTranslation } from "next-i18next"
import Router from "next/router"
import React from "react"
import { connect, ConnectedProps } from "react-redux"
import { Card, CardBody, CardHeader, Col, Row, Spinner } from "reactstrap"
import { AnyAction, Dispatch } from "redux"

import { IFund, UserRole } from "api/schema"
import BaseLayout from "components/BaseLayout"
import ConfirmationForm from "components/common/form/ConfirmationForm"
import StatusCode from "components/common/StatusCode"
import TranslatedHtml from "components/common/TranslatedHtml"
import ErrorPage from "components/ErrorPage"
import { withAuth } from "components/hoc/withAuth"
import Link from "next/link"
import { activateFundAction } from "redux/actions/fundManagement"
import { loadCollectionAction } from "redux/helper/actions"
import { AppState } from "redux/reducer"
import { EntityType, selectById } from "redux/reducer/data"
import { selectManagementFundsLoaded } from "redux/reducer/fundManagement"
import { I18nPage, includeDefaultNamespaces, withTranslation } from "services/i18n"
import { Routes, routeWithParams } from "services/routes"

const mapDispatchToProps = (dispatch: Dispatch<AnyAction>) => ({
  activateFund: (fund, actions) => dispatch(activateFundAction(fund, actions)),
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

const fundEditPage: I18nPage<PageProps> = ({ activateFund, id, fund, request, t, }) => {
  // @todo custom error message "fund not found" etc.
  if (!request.isLoading && !fund) {
    return <StatusCode statusCode={404}>
      <ErrorPage statusCode={404} error={request.loadingError} />
    </StatusCode>
  }

  const onSubmit = (_values, actions) => {
    actions.success = () => {
      Router.push(Routes.fundDetails,
        routeWithParams(Routes.fundDetails, { id: fund.id }))
    }

    activateFund(fund, actions)
  }

  return <BaseLayout pageTitle={t("page.management.funds.activate.title")}>
    <Row>
      <Col>
        <h1>{t("page.management.funds.activate.heading")}</h1>
        <p><TranslatedHtml content="page.management.funds.activate.intro" /></p>

        <Link
          href={Routes.fundDetails}
          as={routeWithParams(Routes.fundDetails, { id })}
        >
          <a className="btn btn-secondary btn-sm">{t("goto.fundManagement")}</a>
        </Link>
      </Col>
    </Row>

    <Row>
      <Col sm={6}>
        {request.isLoading ? <Spinner /> :
          <Card>
            <CardHeader>{t("fund.name")}: {fund.name}</CardHeader>
            <CardBody>
              <p><TranslatedHtml content="page.management.funds.activate.confirm" /></p>
              <ConfirmationForm onSubmit={onSubmit} />
            </CardBody>
          </Card>
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
