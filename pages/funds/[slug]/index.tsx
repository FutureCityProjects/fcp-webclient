import { NextPageContext } from "next"
import { WithTranslation } from "next-i18next"
import React from "react"
import { connect, ConnectedProps } from "react-redux"
import { Col, Row, Spinner } from "reactstrap"

import { FundState, IFund } from "api/schema"
import BaseLayout from "components/BaseLayout"
import StatusCode from "components/common/StatusCode"
import TranslatedHtml from "components/common/TranslatedHtml"
import ErrorPage from "components/ErrorPage"
import PublicFundView from "components/fund/PublicFundView"
import { loadModelAction } from "redux/helper/actions"
import { AppState } from "redux/reducer"
import { EntityType, selectById, selectFundBySlug } from "redux/reducer/data"
import { I18nPage, includeDefaultNamespaces, withTranslation } from "services/i18n"

const mapStateToProps = (state: AppState, { id, slug }) => ({
  fund: id
    ? selectById<IFund>(state, EntityType.FUND, id)
    : selectFundBySlug(state, slug),
  request: state.requests.fundLoading,
})

const connector = connect(mapStateToProps)
type PageProps = ConnectedProps<typeof connector> & WithTranslation & {
  fundId: number
  slug: string,
}

const PublicFuncPage: I18nPage<PageProps> = (props: PageProps) => {
  const { fund, request, t } = props

  // @todo custom error message "project not found or no permission" etc.
  if (!request.isLoading && (!fund || fund.state === FundState.INACTIVE)) {
    return <StatusCode statusCode={404}>
      <ErrorPage statusCode={404} error={request.loadingError} />
    </StatusCode>
  }

  return <BaseLayout pageTitle={fund ? fund.name : "Fördertopfansicht"}>
    {request.isLoading ? <Spinner /> : <>
      <Row>
        <Col>
          <h1>{t("page.funds.slug.heading")}</h1>
          <p><TranslatedHtml content="page.funds.slug.intro" /></p>
          <PublicFundView fund={fund} />
        </Col>
      </Row>
    </>}
  </BaseLayout >
}

PublicFuncPage.getInitialProps = ({ store, query }: NextPageContext) => {
  const slug: string = typeof query.slug === "string" ? query.slug : null
  let id: number = null

  if (slug.match(/^\d+$/)) {
    id = parseInt(slug, 10)

    if (!selectById(store.getState(), EntityType.FUND, id)) {
      store.dispatch(loadModelAction(EntityType.PROJECT, { id }))
    }
  } else if (slug && !selectFundBySlug(store.getState(), slug)) {
    store.dispatch(loadModelAction(EntityType.FUND, { slug }))
  }

  return { id, slug, namespacesRequired: includeDefaultNamespaces() }
}

export default connector(withTranslation(includeDefaultNamespaces())(PublicFuncPage))
