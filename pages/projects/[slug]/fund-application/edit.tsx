import { WithTranslation } from "next-i18next"
import { NextJSContext } from "next-redux-wrapper"
import Router from "next/router"
import React from "react"
import { connect, ConnectedProps } from "react-redux"
import { Col, Row, Spinner } from "reactstrap"

import { ProjectProgress, UserRole } from "api/schema"
import BaseLayout from "components/BaseLayout"
import StatusCode from "components/common/StatusCode"
import TranslatedHtml from "components/common/TranslatedHtml"
import ErrorPage from "components/ErrorPage"
import { withAuth } from "components/hoc/withAuth"
import ApplicationDataForm from "components/project/application/ApplicationDataForm"
import { AnyAction, Dispatch } from "redux"
import { loadMyProjectsAction } from "redux/actions/myProjects"
import { updateModelAction } from "redux/helper/actions"
import { AppState } from "redux/reducer"
import { EntityType } from "redux/reducer/data"
import { selectIsProjectMember, selectMyProjectByIdentifier } from "redux/reducer/myProjects"
import { I18nPage, includeDefaultNamespaces, withTranslation } from "services/i18n"
import { Routes, routeWithParams } from "services/routes"

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

const ProjectApplicationEditPage: I18nPage<PageProps> = ({ isMember, project, request, t, updateProject }) => {
  // @todo custom error message "project not found or no permission" etc.
  if (!request.isLoading && (!project || project.isLocked
    || project.progress === ProjectProgress.CREATING_PROFILE
    || project.progress === ProjectProgress.CREATING_PLAN
    || !isMember)
  ) {
    return <StatusCode statusCode={404}>
      <ErrorPage statusCode={404} error={request.loadingError} />
    </StatusCode>
  }

  const onSubmit = (values, actions) => {
    actions.success = () => {
      Router.push({
        pathname: Routes.PROJECT_FUND_APPLICATION,
        // @todo support multiple applications, how to store which one is the active application?
        query: { fund: project.applications[0].fund.id }
      }, {
        pathname: routeWithParams(Routes.PROJECT_FUND_APPLICATION, { slug: project.slug || project.id }),
        // @todo support multiple applications, how to store which one is the active application?
        query: { fund: project.applications[0].fund.id }
      })
    }

    updateProject(values, actions)
  }

  return <BaseLayout pageTitle={t("page.projects.application.edit.title")}>
    <Row>
      <Col>
        <h1>{t("page.projects.application.edit.heading")}</h1>
        <p><TranslatedHtml content="page.projects.application.edit.intro" params={{ projectName: project.name }} /></p>

        {request.isLoading && <Spinner />}
      </Col>
    </Row>

    {!request.isLoading &&
      <Row>
        <Col lg={8}>
          <ApplicationDataForm
            onSubmit={onSubmit}
            project={project}
          />
        </Col>
      </Row>
    }
  </BaseLayout >
}

ProjectApplicationEditPage.getInitialProps = ({ store, query }: NextJSContext) => {
  // slug could also be the ID
  const slug: string = typeof query.slug === "string" ? query.slug : null
  if (slug && !selectMyProjectByIdentifier(store.getState(), slug)) {
    store.dispatch(loadMyProjectsAction())
  }

  return { slug, namespacesRequired: includeDefaultNamespaces() }
}

export default withAuth(
  connector(
    withTranslation(includeDefaultNamespaces())(ProjectApplicationEditPage),
  ),
  UserRole.USER,
)
