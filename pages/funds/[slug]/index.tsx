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
    ? selectById<IFund>(state, EntityType.Fund, id)
    : selectFundBySlug(state, slug),
  request: state.requests.fundLoading,
})

const connector = connect(mapStateToProps)
type PageProps = ConnectedProps<typeof connector> & WithTranslation & {
  fundId: number
  slug: string
}

const PublicFundPage: I18nPage<PageProps> = (props: PageProps) => {
  const { fund, request, t } = props

  // @todo custom error message "project not found or no permission" etc.
  if (!request.isLoading && (!fund || fund.state === FundState.Inactive)) {
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

PublicFundPage.getInitialProps = ({ store, query }: NextPageContext) => {
  const slug: string = typeof query.slug === "string" ? query.slug : null
  let id: number = null

  if (/^\d+$/.exec(slug)) {
    id = parseInt(slug, 10)

    if (!selectById(store.getState(), EntityType.Fund, id)) {
      store.dispatch(loadModelAction(EntityType.Project, { id }))
    }
  } else if (slug && !selectFundBySlug(store.getState(), slug)) {
    store.dispatch(loadModelAction(EntityType.Fund, { slug }))
  }

  return { id, slug, namespacesRequired: includeDefaultNamespaces() }
}

export default connector(withTranslation(includeDefaultNamespaces())(PublicFundPage))
