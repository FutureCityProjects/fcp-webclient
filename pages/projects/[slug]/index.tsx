import { WithTranslation } from "next-i18next"
import { NextJSContext } from "next-redux-wrapper"
import React from "react"
import { connect, ConnectedProps } from "react-redux"
import { Col, Row, Spinner } from "reactstrap"

import { ProjectProgress, ProjectState } from "api/schema"
import BaseLayout from "components/BaseLayout"
import StatusCode from "components/common/StatusCode"
import ErrorPage from "components/ErrorPage"
import PublicProfile from "components/project/PublicProfile"
import { loadModelAction } from "redux/helper/actions"
import { AppState } from "redux/reducer"
import { EntityType, selectById, selectProjectBySlug } from "redux/reducer/data"
import { I18nPage, includeDefaultNamespaces, withTranslation } from "services/i18n"

const mapStateToProps = (state: AppState, { id, slug }) => ({
  project: id
    ? selectById(state, EntityType.PROJECT, id)
    : selectProjectBySlug(state, slug),
  request: state.requests.projectLoading,
})

const connector = connect(mapStateToProps)
type PageProps = ConnectedProps<typeof connector> & WithTranslation & {
  id: number
  slug: string,
}

const ProjectPage: I18nPage<PageProps> = ({ project, request, t }) => {
  if (!request.isLoading) {
    if (!project
      || project.state === ProjectState.DEACTIVATED
      || project.progress === ProjectProgress.IDEA
    ) {
      return <StatusCode statusCode={404}>
        <ErrorPage statusCode={404} error={request.loadingError} />
      </StatusCode>
    }
  }

  return <BaseLayout pageTitle={project && project.name ? project.name : "Projektansicht"}>
    {request.isLoading ? <Spinner /> : <>
      <Row>
        <Col>
          <h1>{project.name ? project.name : t("project.unnamed")}</h1>
          <div className="d-block"><span>{t("page.projects.index.project.subHeader",
            {
              date: project.createdAt,
              user: project.createdBy ? project.createdBy.username : t("user.unknown")
            })}</span></div>
        </Col>
      </Row>
      <Row>
        <PublicProfile project={project} />
      </Row>
    </>}
  </BaseLayout >
}

ProjectPage.getInitialProps = ({ store, query }: NextJSContext) => {
  const slug: string = typeof query.slug === "string" ? query.slug : null
  let id: number = null

  if (slug.match(/^\d+$/)) {
    id = parseInt(slug, 10)

    if (!selectById(store.getState(), EntityType.PROJECT, id)) {
      store.dispatch(loadModelAction(EntityType.PROJECT, { id }))
    }
  } else if (slug && !selectProjectBySlug(store.getState(), slug)) {
    store.dispatch(loadModelAction(EntityType.PROJECT, { slug }))
  }

  return { id, slug, namespacesRequired: includeDefaultNamespaces() }
}

export default connector(withTranslation(includeDefaultNamespaces())(ProjectPage))
