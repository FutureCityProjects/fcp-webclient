import { NextPageContext } from "next"
import { WithTranslation } from "next-i18next"
import Link from "next/link"
import Router from "next/router"
import React from "react"
import { connect, ConnectedProps } from "react-redux"
import { Card, CardBody, CardHeader, Col, Row, Spinner } from "reactstrap"

import { FundState, IFund, ProjectProgress, UserRole } from "api/schema"
import BaseLayout from "components/BaseLayout"
import PageError from "components/common/PageError"
import StatusCode from "components/common/StatusCode"
import TranslatedHtml from "components/common/TranslatedHtml"
import ErrorPage from "components/ErrorPage"
import { withAuth } from "components/hoc/withAuth"
import FundingForm from "components/project/application/FundingForm"
import { AnyAction, Dispatch } from "redux"
import { loadMyProjectsAction } from "redux/actions/myProjects"
import { loadModelAction, updateModelAction } from "redux/helper/actions"
import { AppState } from "redux/reducer"
import { EntityType, selectById } from "redux/reducer/data"
import { selectIsProjectMember, selectMyProjectByIdentifier } from "redux/reducer/myProjects"
import { I18nPage, includeDefaultNamespaces, withTranslation } from "services/i18n"
import { Routes, routeWithParams } from "services/routes"

const mapDispatchToProps = (dispatch: Dispatch<AnyAction>) => ({
  updateApplication: (application, actions) =>
    dispatch(updateModelAction(EntityType.FundApplication, application, actions))
})

const mapStateToProps = (state: AppState, { fundId, slug }) => ({
  fund: selectById<IFund>(state, EntityType.Fund, fundId),
  fundRequest: state.requests.fundLoading,
  isMember: selectIsProjectMember(state, slug),
  project: selectMyProjectByIdentifier(state, slug),
  projectRequest: state.requests.projectsLoading,
})

const connector = connect(mapStateToProps, mapDispatchToProps)
type PageProps = ConnectedProps<typeof connector> & WithTranslation & {
  fundId: number
  slug: string
}

const ApplicationFundingPage: I18nPage<PageProps> = (props: PageProps) => {
  const { fund, fundRequest, isMember, project, projectRequest, updateApplication, t } = props

  // @todo custom error message "project not found or no permission" etc.
  if (!projectRequest.isLoading && (!project || project.isLocked
    || project.progress === ProjectProgress.CreatingProfile
    || project.progress === ProjectProgress.CreatingPlan
    || !isMember)
  ) {
    return <StatusCode statusCode={404}>
      <ErrorPage statusCode={404} error={projectRequest.loadingError} />
    </StatusCode>
  }

  if (!fundRequest.isLoading && (!fund || fund.state !== FundState.Active)) {
    // @todo custom message: fund not found or not active (edit of concretizations not permitted)
    return <StatusCode statusCode={404}>
      <ErrorPage statusCode={404} error={fundRequest.loadingError} />
    </StatusCode>
  }

  const fundApplication = fund && project.applications.filter((a) => a.fund.id === fund.id).shift()
  if (fund && !fundApplication) {
    // @todo custom message: fund no longer active etc. allow to select new fund
    return <StatusCode statusCode={404}>
      <ErrorPage statusCode={404} error={"failure.fundApplication.notFound"} />
    </StatusCode>
  }

  const onSubmit = (values, actions) => {
    actions.success = () => {
      void Router.push({
        pathname: Routes.ProjectFundApplication,
        query: { fund: fund.id }
      }, {
        pathname: routeWithParams(Routes.ProjectFundApplication, { slug: project.slug || project.id }),
        query: { fund: fund.id }
      })
    }

    updateApplication(values, actions)
  }

  return <BaseLayout pageTitle={t("page.projects.fundApplication.funding.title")}>
    <Row>
      <Col>
        <h1>{t("page.projects.fundApplication.funding.heading")}</h1>
        {(projectRequest.isLoading || fundRequest.isLoading)
          ? <Spinner />
          : <p><TranslatedHtml content="page.projects.fundApplication.funding.intro" params={{ projectName: project.name }} /></p>
        }

        <PageError error={projectRequest.loadingError || fundRequest.loadingError} />

        {(!projectRequest.isLoading && !fundRequest.isLoading) &&
          <Link href={{
            pathname: Routes.ProjectFundApplication,
            query: { fund: fund.id }
          }} as={{
            pathname: routeWithParams(Routes.ProjectFundApplication, { slug: project.slug || project.id }),
            query: { fund: fund.id }
          }} >
            <a className="btn btn-secondary btn-sm">{t("goto.projectApplication")}</a>
          </Link>
        }
      </Col>
    </Row>

    {(!projectRequest.isLoading && !fundRequest.isLoading) && <Row>
      <Col lg={8}>
        <Card>
          <CardHeader>
            {t("fundApplication.fund") + ": " + fund.name}
          </CardHeader>
          <CardBody>
            <h5>{t("fund.minimumGrant")}</h5>
            <p>{t("default.currency", { value: fund.minimumGrant })}</p>

            <h5>{t("fund.maximumGrant")}</h5>
            <p>{t("default.currency", { value: fund.maximumGrant })}</p>

            <FundingForm
              onSubmit={onSubmit}
              application={fundApplication}
            />
          </CardBody>
        </Card>
      </Col>
    </Row>}
  </BaseLayout >
}

ApplicationFundingPage.getInitialProps = ({ store, query }: NextPageContext) => {
  const state = store.getState()

  // slug could also be the ID
  const slug: string = typeof query.slug === "string" ? query.slug : null
  if (slug && !selectMyProjectByIdentifier(state, slug)) {
    store.dispatch(loadMyProjectsAction())
  }

  let fundId: number = null
  if (typeof query.fund === "string" && /^\d+$/.exec(query.fund)) {
    fundId = parseInt(query.fund, 10)
  }

  if (fundId && !selectById(state, EntityType.Fund, fundId)) {
    store.dispatch(loadModelAction(EntityType.Fund, { id: fundId }))
  }

  return { slug, fundId, namespacesRequired: includeDefaultNamespaces() }
}

export default withAuth(
  connector(
    withTranslation(includeDefaultNamespaces())(ApplicationFundingPage),
  ),
  UserRole.User,
)
