import { WithTranslation } from "next-i18next"
import { NextJSContext } from "next-redux-wrapper"
import Link from "next/link"
import React from "react"
import { connect, ConnectedProps } from "react-redux"
import { Col, Row, Spinner } from "reactstrap"
import { AnyAction, Dispatch } from "redux"

import { ProjectProgress, UserRole } from "api/schema"
import BaseLayout from "components/BaseLayout"
import PageError from "components/common/PageError"
import StatusCode from "components/common/StatusCode"
import TranslatedHtml from "components/common/TranslatedHtml"
import ErrorPage from "components/ErrorPage"
import { withAuth } from "components/hoc/withAuth"
import PlanContainer from "components/project/common/PlanContainer"
import FinancesView from "components/project/plan/FinancesView"
import ImpactView from "components/project/plan/ImpactView"
import ImplementationView from "components/project/plan/ImplementationView"
import OutcomeView from "components/project/plan/OutcomeView"
import ResultsView from "components/project/plan/ResultsView"
import SelfAssessment from "components/project/plan/SelfAssessment"
import TargetGroupsView from "components/project/plan/TargetGroupsView"
import TasksView from "components/project/plan/TasksView"
import UtilizationView from "components/project/plan/UtilizationView"
import { loadMyProjectsAction } from "redux/actions/myProjects"
import { updateModelAction } from "redux/helper/actions"
import { AppState } from "redux/reducer"
import { EntityType } from "redux/reducer/data"
import { selectIsProjectMember, selectMyProjectByIdentifier } from "redux/reducer/myProjects"
import { I18nPage, includeDefaultNamespaces, withTranslation } from "services/i18n"
import { Routes } from "services/routes"

const mapDispatchToProps = (dispatch: Dispatch<AnyAction>) => ({
  updateProject: (project, actions) =>
    dispatch(updateModelAction(EntityType.PROJECT, project, actions))
})

const mapStateToProps = (state: AppState, { slug }) => ({
  isMember: selectIsProjectMember(state, slug),
  project: selectMyProjectByIdentifier(state, slug),
  request: state.requests.projectsLoading,
})

const connector = connect(mapStateToProps, mapDispatchToProps)
type PageProps = ConnectedProps<typeof connector> & WithTranslation & {
  slug: string,
}

const ProjectPlanPage: I18nPage<PageProps> = ({ isMember, project, request, t, updateProject }) => {
  // @todo custom error message "project not found or no permission" etc.
  if (!request.isLoading && (!project || project.isLocked
    || project.progress === ProjectProgress.CREATING_PROFILE
    || !isMember)
  ) {
    return <StatusCode statusCode={404}>
      <ErrorPage statusCode={404} error={request.loadingError} />
    </StatusCode>
  }

  const onSubmit = (values, actions) => {
    updateProject(values, actions)
  }

  return <BaseLayout pageTitle={t("page.projects.plan.index.title")}>
    <Row>
      <Col>
        {request.isLoading
          ? <Spinner />
          : <>
            <h1>{t("page.projects.plan.index.heading", { projectName: project.name })}</h1>
            <p><TranslatedHtml content="page.projects.plan.index.intro" /></p>

            <Link
              href={Routes.MY_PROJECTS}
              as={Routes.MY_PROJECTS + "#project-" + project.id}
            >
              <a className="btn btn-secondary btn-sm">{t("goto.myProjects")}</a>
            </Link>
          </>
        }

        <PageError error={request.loadingError} />
      </Col>
    </Row>

    {!request.isLoading &&
      <Row>
        <Col lg>
          <TargetGroupsView project={project} />
          <ResultsView project={project} />
          <OutcomeView project={project} />
          <ImpactView project={project} />
          <UtilizationView project={project} />
        </Col>
        <Col lg>
          <PlanContainer
            component={TasksView}
            project={project}
            updateProject={onSubmit}
          />

          {project.tasks && project.tasks.length &&
            <PlanContainer
              component={ImplementationView}
              project={project}
              updateProject={onSubmit}
            />
          }

          {project.resourceRequirements && project.resourceRequirements.length &&
            <PlanContainer
              component={FinancesView}
              project={project}
              updateProject={onSubmit}
            />
          }
          <SelfAssessment project={project} onSubmit={onSubmit} />
        </Col>
      </Row>
    }
  </BaseLayout >
}

ProjectPlanPage.getInitialProps = ({ store, query }: NextJSContext) => {
  // slug could also be the ID
  const slug: string = typeof query.slug === "string" ? query.slug : null
  if (slug && !selectMyProjectByIdentifier(store.getState(), slug)) {
    store.dispatch(loadMyProjectsAction())
  }

  return { slug, namespacesRequired: includeDefaultNamespaces() }
}

export default withAuth(
  connector(
    withTranslation(includeDefaultNamespaces())(ProjectPlanPage),
  ),
  UserRole.USER,
)
