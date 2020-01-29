import { WithTranslation } from "next-i18next"
import { NextJSContext } from "next-redux-wrapper"
import React from "react"
import { connect, ConnectedProps } from "react-redux"
import { Button, Card, CardBody, CardHeader, Col, Row, Spinner } from "reactstrap"
import { AnyAction, Dispatch } from "redux"

import { FundState, IFund, IFundConcretization, UserRole } from "api/schema"
import BaseLayout from "components/BaseLayout"
import HtmlContent from "components/common/HtmlContent"
import StatusCode from "components/common/StatusCode"
import TranslatedHtml from "components/common/TranslatedHtml"
import ErrorPage from "components/ErrorPage"
import { withAuth } from "components/hoc/withAuth"
import Icon from "components/Icon"
import Link from "next/link"
import { deleteModelAction, loadCollectionAction } from "redux/helper/actions"
import { AppState } from "redux/reducer"
import { EntityType, selectById } from "redux/reducer/data"
import { selectManagementFundsLoaded } from "redux/reducer/fundManagement"
import { DateFormat, formatDate, TimeFormat } from "services/dateFormat"
import { I18nPage, includeDefaultNamespaces, withTranslation } from "services/i18n"
import { Routes, routeWithParams } from "services/routes"

const mapDispatchToProps = (dispatch: Dispatch<AnyAction>) => ({
  deleteConcretization: (concretization) =>
    dispatch(deleteModelAction(EntityType.FUND_CONCRETIZATION, concretization, {}))
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

const FundDetailsPage: I18nPage<PageProps> = ({ deleteConcretization, fund, request, t }) => {
  // @todo custom error message "fund not found" etc.
  if (!request.isLoading && !fund) {
    return <StatusCode statusCode={404}>
      <ErrorPage statusCode={404} error={request.loadingError} />
    </StatusCode>
  }

  const confirmDelete = (concretization) => {
    if (confirm("Soll diese Zuspitzung wirklich gelöscht werden?")) {
      return deleteConcretization(concretization)
    }

    return false
  }

  return <BaseLayout pageTitle={t("page.management.funds.details.title")}>
    <Row>
      <Col>
        <h1>{t("page.management.funds.details.heading")}</h1>
        <p><TranslatedHtml content="page.management.funds.details.intro" /></p>
      </Col>
    </Row>

    {request.isLoading ? <Spinner /> :
      <Row>
        <Col>
          <Card>
            <CardHeader>
              {fund.name}
              <div role="actions" className="icon-navigation">
                <Link href={Routes.FUND_EDIT} as={routeWithParams(Routes.FUND_EDIT, { id: fund.id })}>
                  <a aria-label="edit fund" className="navigation-item" title="Fördertopf bearbeiten">
                    <Icon name={"pencil"} size={24} />
                  </a>
                </Link>
              </div>
            </CardHeader>
            <CardBody>
              <h5>{t("fund.state")}</h5>
              <p>
                {fund.state === FundState.ACTIVE
                  ? <span className="text-success">{t("fund.states.active")}</span>
                  : (fund.state === FundState.FINISHED
                    ? <span className="text-muted">{t("fund.states.finished")}</span>
                    : <span className="text-warning">{t("fund.states.inactive")}</span>
                  )}
                {fund.state === FundState.INACTIVE && <>
                  <br />
                  <Link href={Routes.FUND_ACTIVATE} as={routeWithParams(Routes.FUND_ACTIVATE, { id: fund.id })}>
                    <Button color="primary" className="btn-sm">
                      {t("goto.activateFund")}
                    </Button>
                  </Link>
                </>}
              </p>

              <h5>{t("fund.description")}</h5>
              <HtmlContent content={fund.description} />

              <h5>{t("fund.region")}</h5>
              <p><HtmlContent content={fund.region} /></p>

              <h5>{t("fund.criteria")}</h5>
              {fund.criteria && fund.criteria.length
                ? <ul>
                  {fund.criteria.map((c, index) => <li key={index}>{c}</li>)}
                </ul>
                : <p>{t("default.empty")}</p>
              }

              <h5>{t("fund.sponsor")}</h5>
              <HtmlContent content={fund.sponsor} />

              <h5>{t("fund.imprint")}</h5>
              <HtmlContent content={fund.imprint} />
            </CardBody>
          </Card>

          <Card>
            <CardHeader>
              {t("page.management.funds.details.fundingHeader")}
              <div role="actions" className="icon-navigation">
                <Link href={Routes.FUND_EDIT}
                  as={routeWithParams(Routes.FUND_EDIT, { id: fund.id }) + "#form-fund-funding"}>
                  <a aria-label="edit fund" className="navigation-item" title="Fördertopf bearbeiten">
                    <Icon name={"pencil"} size={24} />
                  </a>
                </Link>
              </div>
            </CardHeader>

            <h5>{t("fund.budget")}</h5>
            <p>{fund.budget}</p>

            <h5>{t("fund.maximumGrant")}</h5>
            <p>{fund.maximumGrant}</p>

            <h5>{t("fund.minimumGrant")}</h5>
            <p>{fund.minimumGrant}</p>
          </Card>

          <Card>
            <CardHeader>
              {t("page.management.funds.details.applicationHeader")}
              <div role="actions" className="icon-navigation">
                <Link href={Routes.FUND_EDIT}
                  as={routeWithParams(Routes.FUND_EDIT, { id: fund.id }) + "#form-fund-application"}>
                  <a aria-label="edit fund" className="navigation-item" title="Fördertopf bearbeiten">
                    <Icon name={"pencil"} size={24} />
                  </a>
                </Link>
              </div>
            </CardHeader>
            <CardBody>
              <h5>{t("fund.submissionBegin")}</h5>
              <p>{fund.submissionBegin
                ? formatDate(fund.submissionBegin, DateFormat.LONG, TimeFormat.MINUTES)
                : t("default.empty")}</p>

              <h5>{t("fund.submissionEnd")}</h5>
              <p>{fund.submissionEnd
                ? formatDate(fund.submissionEnd, DateFormat.LONG, TimeFormat.MINUTES)
                : t("default.empty")}</p>

              <h5 id="concretizations">{t("fund.concretizations")}</h5>
              {fund.concretizations && fund.concretizations.length > 0
                ? <ul>
                  {fund.concretizations.map((c: IFundConcretization) => <li key={c.id}>
                    <dt>
                      {c.question}
                      <Link href={{
                        pathname: Routes.CONCRETIZATION_EDIT, query: { concretization: c.id }
                      }} as={{ pathname: routeWithParams(Routes.CONCRETIZATION_EDIT, { id: fund.id, concretizationId: c.id }), query: { concretization: c.id } }}>
                        <Button color="secondary" title="Bearbeiten">
                          <Icon name="pencil" color="white" size={18} />
                        </Button>
                      </Link>
                      <Button color="secondary" onClick={() => confirmDelete(c)} title="Löschen">
                        <Icon name="trash" color="white" size={18} />
                      </Button>
                    </dt>
                    {c.description && <dd><HtmlContent content={c.description} /></dd>}
                    <small>{t("fundConcretization.maxLength")}: {c.maxLength}</small>
                  </li>)}
                </ul>
                : <p>{t("default.empty")}</p>
              }
              <Link href={Routes.CONCRETIZATION_CREATE} as={routeWithParams(Routes.CONCRETIZATION_CREATE, { id: fund.id })}>
                <Button color="primary">{t("form.fund.addConcretization")}</Button>
              </Link>
            </CardBody>
          </Card>

          <Card>
            <CardHeader>
              {t("page.management.funds.details.juryHeader")}
              <div role="actions" className="icon-navigation">
                <Link href={Routes.FUND_EDIT}
                  as={routeWithParams(Routes.FUND_EDIT, { id: fund.id }) + "#form-fund-jury"}>
                  <a aria-label="edit fund" className="navigation-item" title="Fördertopf bearbeiten">
                    <Icon name={"pencil"} size={24} />
                  </a>
                </Link>
              </div>
            </CardHeader>
            <CardBody>
              <h5>{t("fund.jurorsPerApplication")}</h5>
              <p>{fund.jurorsPerApplication}</p>

              <h5>{t("fund.juryCriteria")}</h5>
              {(!fund.juryCriteria || fund.juryCriteria.length === 0) && <p>{t("default.empty")}</p>}
              {fund.juryCriteria && fund.juryCriteria.map((c) => <p>{c}</p>)}

              <h5>{t("fund.ratingBegin")}</h5>
              <p>{fund.ratingBegin
                ? formatDate(fund.ratingBegin, DateFormat.LONG)
                : t("default.empty")}</p>

              <h5>{t("fund.ratingEnd")}</h5>
              <p>{fund.ratingEnd
                ? formatDate(fund.ratingEnd, DateFormat.LONG)
                : t("default.empty")}</p>

              <h5>{t("fund.briefingDate")}</h5>
              <p>{fund.briefingDate
                ? formatDate(fund.briefingDate, DateFormat.LONG)
                : t("default.empty")}</p>

              <h5>{t("fund.finalJuryDate")}</h5>
              <p>{fund.finalJuryDate
                ? formatDate(fund.finalJuryDate, DateFormat.LONG)
                : t("default.empty")}</p>
            </CardBody>
          </Card>
        </Col>
      </Row>
    }
  </BaseLayout>
}

FundDetailsPage.getInitialProps = ({ store, query }: NextJSContext) => {
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
    withTranslation(includeDefaultNamespaces())(FundDetailsPage),
  ),
  UserRole.PROCESS_OWNER,
)
