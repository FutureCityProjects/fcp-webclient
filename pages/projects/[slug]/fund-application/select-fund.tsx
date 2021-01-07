import { NextPageContext } from "next"
import { WithTranslation } from "next-i18next"
import Link from "next/link"
import Router from "next/router"
import React from "react"
import { connect, ConnectedProps } from "react-redux"
import { Button, Col, Row, Spinner } from "reactstrap"
import { AnyAction, Dispatch } from "redux"

import { IFund, IFundApplication, ProjectProgress, ProjectState, UserRole } from "api/schema"
import BaseLayout from "components/BaseLayout"
import PageError from "components/common/PageError"
import StatusCode from "components/common/StatusCode"
import TranslatedHtml from "components/common/TranslatedHtml"
import ErrorPage from "components/ErrorPage"
import { withAuth } from "components/hoc/withAuth"
import SelectFundCard from "components/project/application/SelectFundCard"
import { loadMyProjectsAction } from "redux/actions/myProjects"
import { createModelAction, loadCollectionAction } from "redux/helper/actions"
import { AppState } from "redux/reducer"
import { EntityType, selectCollectionByIds } from "redux/reducer/data"
import { selectIsProjectMember, selectIsProjectOwner, selectMyProjectByIdentifier } from "redux/reducer/myProjects"
import { I18nPage, includeDefaultNamespaces, withTranslation } from "services/i18n"
import { Routes, routeWithParams } from "services/routes"

const mapDispatchToProps = (dispatch: Dispatch<AnyAction>) => ({
  createApplication: (application, actions) => {
    dispatch(createModelAction(EntityType.FundApplication, application, actions))
  },
})

const mapStateToProps = (state: AppState, { slug }) => ({
  project: selectMyProjectByIdentifier(state, slug),
  projectRequest: state.requests.projectsLoading,
  fundsRequest: state.requests.fundsLoading,
  isMember: selectIsProjectMember(state, slug),
  isOwner: selectIsProjectOwner(state, slug),
  selectableFunds: selectCollectionByIds(state, EntityType.Fund, state.myProjects.selectableFunds || []),
})

const connector = connect(mapStateToProps, mapDispatchToProps)
type PageProps = ConnectedProps<typeof connector> & WithTranslation & {
  slug: string
}

const FundSelectionPage: I18nPage<PageProps> = (props: PageProps) => {
  const { createApplication, fundsRequest, isMember, isOwner, project, projectRequest, selectableFunds, t } = props

  // @todo custom error message "project not found or no permission" etc.
  if (!projectRequest.isLoading && (!project || project.isLocked
    || project.progress === ProjectProgress.CreatingProfile
    || !isMember)
  ) {
    return <StatusCode statusCode={404}>
      <ErrorPage statusCode={404} error={projectRequest.loadingError} />
    </StatusCode>
  }

  // @todo Fehlermeldung "Projekt deaktiviert"
  if (project && project.state === ProjectState.Deactivated) {
    return <StatusCode statusCode={404}>
      <ErrorPage statusCode={404} error={projectRequest.loadingError} />
    </StatusCode>
  }

  const selectFund = (fund, actions) => {
    actions.success = () => {
      void Router.push({ pathname: Routes.ProjectConcretization, query: { fund: fund.id } },
        { pathname: routeWithParams(Routes.ProjectConcretization, { slug: project.slug }), query: { fund: fund.id } })
    }

    const application: IFundApplication = {
      fund: fund["@id"],
      project: project["@id"],
    }
    return createApplication(application, actions)
  }

  return <BaseLayout pageTitle={t("page.projects.fundApplication.selectFund.title")}>
    <Row>
      <Col>
        <h1>{t("page.projects.fundApplication.selectFund.heading")}</h1>

        {(projectRequest.isLoading || fundsRequest.isLoading)
          ? <Spinner />
          : <p><TranslatedHtml content="page.projects.fundApplication.selectFund.intro" params={{ projectName: project.name }} /></p>
        }
      </Col>
    </Row>

    <Row>
      <Col>
        {(!projectRequest.isLoading && !fundsRequest.isLoading) && <>
          <PageError error={projectRequest.loadingError || fundsRequest.loadingError} />

          <Link href={Routes.MyProjects} as={Routes.MyProjects + "#project-" + project.id.toString()}>
            <Button color="secondary" className="btn-sm">{t("goto.myProjects")}</Button>
          </Link>
          <br />

          {!isOwner && <p className="text-danger">{t("page.projects.fundApplication.selectFund.allowedOnlyForProjectOwner")}</p>}

          <br />
          {selectableFunds.length
            ? <>
              <h3>{t("page.projects.fundApplication.selectFund.availableFunds")}</h3>
              {selectableFunds.map((fund: IFund) => <SelectFundCard
                fund={fund}
                selectable={isOwner}
                key={fund.id}
                selectFund={(_values, actions) => selectFund(fund, actions)}
              />)}
            </>
            : <p>{t("page.projects.fundApplication.selectFund.noAvailableFunds")}</p>
          }
        </>}
      </Col>
    </Row>
  </BaseLayout >
}

FundSelectionPage.getInitialProps = ({ store, query }: NextPageContext) => {
  const state: AppState = store.getState()

  // slug could also be the ID
  const slug: string = typeof query.slug === "string" ? query.slug : null
  if (slug && !selectMyProjectByIdentifier(state, slug)) {
    store.dispatch(loadMyProjectsAction())
  }

  if (state.myProjects.selectableFunds === null) {
    // @todo filter for active only, no need to fetch finished/paused funds
    store.dispatch(loadCollectionAction(EntityType.Fund, {}, "selectable_funds"))
  }

  return { slug, namespacesRequired: includeDefaultNamespaces() }
}

export default withAuth(
  connector(
    withTranslation(includeDefaultNamespaces())(FundSelectionPage),
  ),
  UserRole.User,
)
