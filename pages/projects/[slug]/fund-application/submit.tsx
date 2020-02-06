import { WithTranslation } from "next-i18next"
import { NextJSContext } from "next-redux-wrapper"
import Link from "next/link"
import Router from "next/router"
import React from "react"
import { connect, ConnectedProps } from "react-redux"
import { Card, CardBody, CardHeader, Col, Row, Spinner } from "reactstrap"

import { FundState, IFund, ProjectProgress, UserRole } from "api/schema"
import BaseLayout from "components/BaseLayout"
import ConfirmationForm from "components/common/form/ConfirmationForm"
import PageError from "components/common/PageError"
import StatusCode from "components/common/StatusCode"
import TranslatedHtml from "components/common/TranslatedHtml"
import ErrorPage from "components/ErrorPage"
import { withAuth } from "components/hoc/withAuth"
import { AnyAction, Dispatch } from "redux"
import { loadMyProjectsAction, submitFundApplicationAction } from "redux/actions/myProjects"
import { loadModelAction } from "redux/helper/actions"
import { AppState } from "redux/reducer"
import { EntityType, selectById } from "redux/reducer/data"
import { selectMyProjectByIdentifier } from "redux/reducer/myProjects"
import { I18nPage, includeDefaultNamespaces, withTranslation } from "services/i18n"
import { Routes } from "services/routes"

const mapDispatchToProps = (dispatch: Dispatch<AnyAction>) => ({
  submitApplication: (application, actions) =>
    dispatch(submitFundApplicationAction(application, actions))
})

const mapStateToProps = (state: AppState, { fundId, slug }) => ({
  fund: selectById<IFund>(state, EntityType.FUND, fundId),
  fundRequest: state.requests.fundLoading,
  project: selectMyProjectByIdentifier(state, slug),
  projectRequest: state.requests.projectsLoading,
})

const connector = connect(mapStateToProps, mapDispatchToProps)
type PageProps = ConnectedProps<typeof connector> & WithTranslation & {
  fundId: number
  slug: string,
}

const ApplicationFundingPage: I18nPage<PageProps> = (props: PageProps) => {
  const { fund, fundRequest, project, projectRequest, submitApplication, t } = props

  // @todo custom error message "project not found or no permission" etc.
  if (!projectRequest.isLoading && (!project || project.isLocked
    || project.progress === ProjectProgress.CREATING_PROFILE
    || project.progress === ProjectProgress.CREATING_PLAN)
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

  const onSubmit = (_values, actions) => {
    actions.success = () => {
      Router.push(Routes.MY_PROJECTS, Routes.MY_PROJECTS + "#project-" + project.id)
    }

    submitApplication(fundApplication, actions)
  }

  return <BaseLayout pageTitle={t("page.projects.application.submit.title")}>
    <Row>
      <Col>
        <h1>{t("page.projects.application.submit.heading")}</h1>
        <p><TranslatedHtml content="page.projects.application.submit.intro" params={{ projectName: project.name }} /></p>

        {(projectRequest.isLoading || fundRequest.isLoading) && <Spinner />}
        <PageError error={projectRequest.loadingError || fundRequest.loadingError} />

        <Link
          href={Routes.MY_PROJECTS}
          as={Routes.MY_PROJECTS + "#project-" + project.id}
        >
          <a className="btn btn-secondary btn-sm">{t("goto.myProjects")}</a>
        </Link>
      </Col>
    </Row>

    {(!projectRequest.isLoading && !fundRequest.isLoading) && <Row>
      <Col lg={8}>
        <Card>
          <CardHeader>
            {t("fundApplication.fund") + ": " + fund.name}
          </CardHeader>
          <CardBody>
            <h5>{t("fund.submissionBegin")}</h5>
            <p>{t("default.longDateTime", { value: fund.submissionBegin })}</p>

            <h5>{t("fund.submissionEnd")}</h5>
            <p>{t("default.longDateTime", { value: fund.submissionEnd })}</p>

            <ConfirmationForm
              buttonLabel="page.projects.application.submit.confirmSubmit"
              onSubmit={onSubmit}
            />
          </CardBody>
        </Card>
      </Col>
    </Row>}
  </BaseLayout >
}

ApplicationFundingPage.getInitialProps = ({ store, query }: NextJSContext) => {
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
    withTranslation(includeDefaultNamespaces())(ApplicationFundingPage),
  ),
  UserRole.USER,
)