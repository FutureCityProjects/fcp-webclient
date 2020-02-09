import { WithTranslation } from "next-i18next"
import { NextJSContext } from "next-redux-wrapper"
import Router from "next/router"
import React from "react"
import { connect, ConnectedProps } from "react-redux"
import { Col, Row, Spinner } from "reactstrap"
import { AnyAction, Dispatch } from "redux"

import { ProjectProgress, UserRole } from "api/schema"
import BaseLayout from "components/BaseLayout"
import StatusCode from "components/common/StatusCode"
import TranslatedHtml from "components/common/TranslatedHtml"
import ErrorPage from "components/ErrorPage"
import { withAuth } from "components/hoc/withAuth"
import PlanContainer from "components/project/common/PlanContainer"
import ProjectTasks from "components/project/tasks/ProjectTasks"
import { loadMyProjectsAction } from "redux/actions/myProjects"
import { updateModelAction } from "redux/helper/actions"
import { AppState } from "redux/reducer"
import { EntityType } from "redux/reducer/data"
import { selectMyProjectByIdentifier } from "redux/reducer/myProjects"
import { I18nPage, includeDefaultNamespaces, withTranslation } from "services/i18n"
import { Routes, routeWithParams } from "services/routes"

const mapDispatchToProps = (dispatch: Dispatch<AnyAction>) => ({
  updateProject: (project, actions) =>
    dispatch(updateModelAction(EntityType.PROJECT, project, actions))
})

const mapStateToProps = (state: AppState, { slug }) => ({
  project: selectMyProjectByIdentifier(state, slug),
  request: state.requests.projectsLoading,
})

const connector = connect(mapStateToProps, mapDispatchToProps)
type PageProps = ConnectedProps<typeof connector> & WithTranslation & {
  slug: string,
}

const ProjectTasksPage: I18nPage<PageProps> = ({ project, request, t, updateProject }) => {
  // @todo custom error message "project not found or no permission" etc.
  if (!request.isLoading && (!project || project.isLocked || project.progress === ProjectProgress.CREATING_PROFILE)) {
    return <StatusCode statusCode={404}>
      <ErrorPage statusCode={404} error={request.loadingError} />
    </StatusCode>
  }

  const onSubmit = (values, actions) => {
    actions.success = () => {
      Router.push(Routes.PROJECT_PLAN,
        routeWithParams(Routes.PROJECT_PLAN, { slug: project.slug || project.id }))
    }

    updateProject(values, actions)
  }

  return <BaseLayout pageTitle={t("page.projects.plan.tasks.title")}>
    <Row>
      <Col>
        <h1>{t("page.projects.plan.tasks.heading")}</h1>
        <p><TranslatedHtml content="page.projects.plan.tasks.intro" params={{ projectName: project.name }} /></p>
      </Col>
    </Row>

    <Row>
      <Col>
        {request.isLoading ? <Spinner /> :
          <PlanContainer
            component={ProjectTasks}
            project={project}
            updateProject={onSubmit}
          />
        }
      </Col>
    </Row>
  </BaseLayout>
}

ProjectTasksPage.getInitialProps = ({ store, query }: NextJSContext) => {
  // slug could also be the ID
  const slug: string = typeof query.slug === "string" ? query.slug : null
  if (slug && !selectMyProjectByIdentifier(store.getState(), slug)) {
    store.dispatch(loadMyProjectsAction())
  }

  return { slug, namespacesRequired: includeDefaultNamespaces() }
}

export default withAuth(
  connector(
    withTranslation(includeDefaultNamespaces())(ProjectTasksPage),
  ),
  UserRole.USER,
)
