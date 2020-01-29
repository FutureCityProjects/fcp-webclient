import { WithTranslation } from "next-i18next"
import { NextJSContext } from "next-redux-wrapper"
import Router from "next/router"
import React from "react"
import { connect, ConnectedProps } from "react-redux"
import { Col, Row, Spinner } from "reactstrap"
import { AnyAction, Dispatch } from "redux"

import { IFund, IFundApplication, ProjectState, UserRole } from "api/schema"
import BaseLayout from "components/BaseLayout"
import PageError from "components/common/PageError"
import StatusCode from "components/common/StatusCode"
import TranslatedHtml from "components/common/TranslatedHtml"
import ErrorPage from "components/ErrorPage"
import SelectFundCard from "components/fund/SelectFundCard"
import { withAuth } from "components/hoc/withAuth"
import { loadMyProjectsAction } from "redux/actions/myProjects"
import { createModelAction, loadCollectionAction } from "redux/helper/actions"
import { AppState } from "redux/reducer"
import { EntityType, selectCollectionByIds } from "redux/reducer/data"
import { selectIsProjectOwner, selectMyProjectByIdentifier } from "redux/reducer/myProjects"
import { I18nPage, includeDefaultNamespaces, withTranslation } from "services/i18n"
import { Routes, routeWithParams } from "services/routes"

const mapDispatchToProps = (dispatch: Dispatch<AnyAction>) => ({
  createApplication: (application, actions) => {
    dispatch(createModelAction(EntityType.FUND_APPLICATION, application, actions))
  },
})

const mapStateToProps = (state: AppState, { slug }) => ({
  project: selectMyProjectByIdentifier(state, slug),
  projectRequest: state.requests.projectsLoading,
  fundsRequest: state.requests.fundsLoading,
  selectableFunds: selectCollectionByIds(state, EntityType.FUND, state.myProjects.selectableFunds || []),
  isOwner: selectIsProjectOwner(state, slug),
})

const connector = connect(mapStateToProps, mapDispatchToProps)
type PageProps = ConnectedProps<typeof connector> & WithTranslation & {
  slug: string,
}

const FundSelectionPage: I18nPage<PageProps> = (props: PageProps) => {
  const { createApplication, fundsRequest, isOwner, project, projectRequest, selectableFunds, t } = props

  // @todo custom error message "project not found or no permission" etc.
  if (!projectRequest.isLoading && !project) {
    return <StatusCode statusCode={404}>
      <ErrorPage statusCode={404} error={projectRequest.loadingError} />
    </StatusCode>
  }

  // @todo bearbeiten wenn deaktiviert? Fehlermeldung "Projekt deaktiviert"
  if (project && project.state === ProjectState.DEACTIVATED) {
    return <StatusCode statusCode={404}>
      <ErrorPage statusCode={404} error={projectRequest.loadingError} />
    </StatusCode>
  }

  const selectFund = (fund, actions) => {
    actions.success = () => {
      Router.push({ pathname: Routes.PROJECT_CONCRETIZATION, query: { fund: fund.id } },
        { pathname: routeWithParams(Routes.PROJECT_CONCRETIZATION, { slug: project.slug }), query: { fund: fund.id } })
    }

    const application: IFundApplication = {
      fund: fund["@id"],
      project: project["@id"],
    }
    return createApplication(application, actions)
  }

  return <BaseLayout pageTitle={t("page.projects.selectFund.title")}>
    <Row>
      <Col>
        <h1>{t("page.projects.selectFund.heading")}</h1>
        <p><TranslatedHtml content="page.projects.selectFund.intro" params={{ projectName: project.name }} /></p>
      </Col>
    </Row>

    {(projectRequest.isLoading || fundsRequest.isLoading) && <Spinner />}

    {(!projectRequest.isLoading && !fundsRequest.isLoading) &&
      <Row>
        <Col>
          <PageError error={projectRequest.loadingError || fundsRequest.loadingError} />

          {!isOwner && <p className="text-danger">{t("page.projects.selectFund.allowedOnlyForProjectOwner")}</p>}

          <br />
          <h3>{t("page.projects.selectFund.availableFunds")}</h3>
          {selectableFunds.map((fund: IFund) => <SelectFundCard
            fund={fund}
            selectable={isOwner}
            key={fund.id}
            selectFund={(_values, actions) => selectFund(fund, actions)}
          />)}
        </Col>
      </Row>
    }
  </BaseLayout >
}

FundSelectionPage.getInitialProps = ({ store, query }: NextJSContext) => {
  const state: AppState = store.getState()

  // slug could also be the ID
  const slug: string = typeof query.slug === "string" ? query.slug : null
  if (slug && !selectMyProjectByIdentifier(state, slug)) {
    store.dispatch(loadMyProjectsAction())
  }

  if (state.myProjects.selectableFunds === null) {
    // @todo filter for active only, no need to fetch finished/paused funds
    store.dispatch(loadCollectionAction(EntityType.FUND, {}, "selectable_funds"))
  }

  return { slug, namespacesRequired: includeDefaultNamespaces() }
}

export default withAuth(
  connector(
    withTranslation(includeDefaultNamespaces())(FundSelectionPage),
  ),
  UserRole.USER,
)
