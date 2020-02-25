import { WithTranslation } from "next-i18next"
import { NextJSContext } from "next-redux-wrapper"
import Link from "next/link"
import React from "react"
import { connect, ConnectedProps } from "react-redux"
import { Col, Row, Spinner } from "reactstrap"

import { FundState, IFund, ProjectProgress, UserRole } from "api/schema"
import BaseLayout from "components/BaseLayout"
import PageError from "components/common/PageError"
import StatusCode from "components/common/StatusCode"
import TranslatedHtml from "components/common/TranslatedHtml"
import ErrorPage from "components/ErrorPage"
import { withAuth } from "components/hoc/withAuth"
import DataView from "components/project/application/DataView"
import FundingView from "components/project/application/FundingView"
import SelfAssessmentForm from "components/project/application/SelfAssessmentForm"
import { AnyAction, Dispatch } from "redux"
import { loadMyProjectsAction } from "redux/actions/myProjects"
import { loadModelAction, updateModelAction } from "redux/helper/actions"
import { AppState } from "redux/reducer"
import { EntityType, selectById } from "redux/reducer/data"
import { selectIsProjectMember, selectMyProjectByIdentifier } from "redux/reducer/myProjects"
import { I18nPage, includeDefaultNamespaces, withTranslation } from "services/i18n"
import { Routes } from "services/routes"

const mapDispatchToProps = (dispatch: Dispatch<AnyAction>) => ({
  updateApplication: (application, actions) =>
    dispatch(updateModelAction(EntityType.FUND_APPLICATION, application, actions))
})

const mapStateToProps = (state: AppState, { fundId, slug }) => ({
  fund: selectById<IFund>(state, EntityType.FUND, fundId),
  fundRequest: state.requests.fundLoading,
  isMember: selectIsProjectMember(state, slug),
  project: selectMyProjectByIdentifier(state, slug),
  projectRequest: state.requests.projectsLoading,
})

const connector = connect(mapStateToProps, mapDispatchToProps)
type PageProps = ConnectedProps<typeof connector> & WithTranslation & {
  fundId: number
  slug: string,
}

const ProjectApplicationPage: I18nPage<PageProps> = (props: PageProps) => {
  const { fund, fundRequest, isMember, project, projectRequest, updateApplication, t } = props

  // @todo custom error message "project not found or no permission" etc.
  if (!projectRequest.isLoading && (!project || project.isLocked
    || project.progress === ProjectProgress.CREATING_PROFILE
    || project.progress === ProjectProgress.CREATING_PLAN
    || !isMember)
  ) {
    return <StatusCode statusCode={404}>
      <ErrorPage statusCode={404} error={projectRequest.loadingError} />
    </StatusCode>
  }

  if (!fundRequest.isLoading && (!fund || fund.state !== FundState.ACTIVE)) {
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

  return <BaseLayout pageTitle={t("page.projects.fundApplication.index.title")}>
    <Row>
      <Col>
        <h1>{t("page.projects.fundApplication.index.heading")}</h1>
        {(projectRequest.isLoading || fundRequest.isLoading)
          ? <Spinner />
          : <>
            <p><TranslatedHtml content="page.projects.fundApplication.index.intro" params={{ projectName: project.name }} /></p>

            <Link
              href={Routes.MY_PROJECTS}
              as={Routes.MY_PROJECTS + "#project-" + project.id}
            >
              <a className="btn btn-secondary btn-sm">{t("goto.myProjects")}</a>
            </Link>
          </>
        }

        <PageError error={projectRequest.loadingError || fundRequest.loadingError} />
      </Col>
    </Row>

    {(!projectRequest.isLoading && !fundRequest.isLoading) && <Row>
      <Col lg>
        <DataView project={project} />
      </Col>
      <Col lg>
        <FundingView application={fundApplication} fund={fund} project={project} />
        <SelfAssessmentForm application={fundApplication} onSubmit={updateApplication} />
      </Col>
    </Row>}
  </BaseLayout >
}

ProjectApplicationPage.getInitialProps = ({ store, query }: NextJSContext) => {
  const state = store.getState()

  // slug could also be the ID
  const slug: string = typeof query.slug === "string" ? query.slug : null
  if (slug && !selectMyProjectByIdentifier(state, slug)) {
    store.dispatch(loadMyProjectsAction())
  }

  let fundId: number = null
  if (typeof query.fund === "string" && query.fund.match(/^\d+$/)) {
    fundId = parseInt(query.fund, 10)
  }

  if (fundId && !selectById(state, EntityType.FUND, fundId)) {
    store.dispatch(loadModelAction(EntityType.FUND, { id: fundId }))
  }

  return { slug, fundId, namespacesRequired: includeDefaultNamespaces() }
}

export default withAuth(
  connector(
    withTranslation(includeDefaultNamespaces())(ProjectApplicationPage),
  ),
  UserRole.USER,
)
