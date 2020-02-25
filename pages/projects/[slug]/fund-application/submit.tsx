import { parseISO } from "date-fns"
import { WithTranslation } from "next-i18next"
import { NextJSContext } from "next-redux-wrapper"
import Link from "next/link"
import Router from "next/router"
import React from "react"
import { connect, ConnectedProps } from "react-redux"
import { Card, CardBody, CardHeader, Col, Row, Spinner } from "reactstrap"
import { AnyAction, Dispatch } from "redux"

import { FundState, IFund, ISubmissionData, ProjectProgress, UserRole } from "api/schema"
import BaseLayout from "components/BaseLayout"
import ConfirmationForm from "components/common/form/ConfirmationForm"
import PageError from "components/common/PageError"
import StatusCode from "components/common/StatusCode"
import TranslatedHtml from "components/common/TranslatedHtml"
import ErrorPage from "components/ErrorPage"
import { withAuth } from "components/hoc/withAuth"
import SubmissionView from "components/project/application/SubmissionView"
import { loadMyProjectsAction, submitFundApplicationAction } from "redux/actions/myProjects"
import { loadModelAction } from "redux/helper/actions"
import { AppState } from "redux/reducer"
import { EntityType, selectById } from "redux/reducer/data"
import { selectIsProjectMember, selectIsProjectOwner, selectMyProjectByIdentifier } from "redux/reducer/myProjects"
import { I18nPage, includeDefaultNamespaces, withTranslation } from "services/i18n"
import { Routes } from "services/routes"

const mapDispatchToProps = (dispatch: Dispatch<AnyAction>) => ({
  submitApplication: (application, actions) =>
    dispatch(submitFundApplicationAction(application, actions))
})

const mapStateToProps = (state: AppState, { fundId, slug }) => ({
  fund: selectById<IFund>(state, EntityType.FUND, fundId),
  fundRequest: state.requests.fundLoading,
  isMember: selectIsProjectMember(state, slug),
  isOwner: selectIsProjectOwner(state, slug),
  project: selectMyProjectByIdentifier(state, slug),
  projectRequest: state.requests.projectsLoading,
})

const connector = connect(mapStateToProps, mapDispatchToProps)
type PageProps = ConnectedProps<typeof connector> & WithTranslation & {
  fundId: number
  slug: string,
}

const SubmitApplicationPage: I18nPage<PageProps> = (props: PageProps) => {
  const { fund, fundRequest, isMember, isOwner, project, projectRequest, submitApplication, t } = props

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

  const onSubmit = (_values, actions) => {
    actions.success = () => {
      Router.push(Routes.MY_PROJECTS, Routes.MY_PROJECTS + "#project-" + project.id)
    }

    submitApplication(fundApplication, actions)
  }

  const now = new Date()
  const submissionBegin = fund && parseISO(fund.submissionBegin as string)
  const submissionEnd = fund && parseISO(fund.submissionEnd as string)

  const submissionData: ISubmissionData = project && fundApplication && {
    name: project.name,
    shortDescription: project.shortDescription,
    description: project.description,
    goal: project.goal,
    challenges: project.challenges,
    vision: project.vision,
    delimitation: project.delimitation,
    implementationBegin: project.implementationBegin as string,
    implementationTime: project.implementationTime,
    impact: project.impact,
    outcome: project.outcome,
    targetGroups: project.targetGroups,
    results: project.results,
    utilization: project.utilization,
    tasks: project.tasks,
    workPackages: project.workPackages,
    resourceRequirements: project.resourceRequirements,
    contactEmail: project.contactEmaiL,
    contactName: project.contactName,
    contactPhone: project.contactPhone,
    holderAddressInfo: project.holderAddressInfo,
    holderCity: project.holderCity,
    holderName: project.holderName,
    holderStreet: project.holderStreet,
    holderZipCode: project.holderZipCode,
    concretizations: fundApplication.concretizations,
    requestedFunding: fundApplication.requestedFunding,
  }

  return <BaseLayout pageTitle={t("page.projects.fundApplication.submit.title")}>
    <Row>
      <Col>
        <h1>{t("page.projects.fundApplication.submit.heading")}</h1>
        {(projectRequest.isLoading || fundRequest.isLoading) ?
          <Spinner />
          : <>
            <p><TranslatedHtml content="page.projects.fundApplication.submit.intro" params={{ projectName: project.name }} /></p>
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
      <Col>
        <SubmissionView fund={fund} submission={submissionData} />

        <Card className="body-card">
          <CardHeader>
            {t("page.projects.fundApplication.submit.submissionHeader")}
          </CardHeader>
          <CardBody>
            <h5>{t("fund.submissionBegin")}</h5>
            <p className={now < submissionBegin ? "text-danger" : undefined}>{t("default.longDateTime", { value: fund.submissionBegin })}</p>

            <h5>{t("fund.submissionEnd")}</h5>
            <p className={now > submissionEnd ? "text-danger" : undefined}>{t("default.longDateTime", { value: fund.submissionEnd })}</p>

            {isOwner
              ? submissionBegin <= now && now <= submissionEnd
                ? <ConfirmationForm
                  buttonLabel="page.projects.fundApplication.submit.confirmSubmit"
                  onSubmit={onSubmit}
                />
                : t("page.projects.fundApplication.submit.outsideSubmissionPeriod")

              : <p className="text-danger">{t("page.projects.fundApplication.submit.allowedOnlyForProjectOwner")}</p>
            }
          </CardBody>
        </Card>
      </Col>
    </Row>}
  </BaseLayout >
}

SubmitApplicationPage.getInitialProps = ({ store, query }: NextJSContext) => {
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
    withTranslation(includeDefaultNamespaces())(SubmitApplicationPage),
  ),
  UserRole.USER,
)
