import { WithTranslation } from "next-i18next"
import { NextJSContext } from "next-redux-wrapper"
import Link from "next/link"
import React from "react"
import { connect, ConnectedProps } from "react-redux"
import { Col, Row, Spinner } from "reactstrap"

import { ProjectState } from "api/schema"
import BaseLayout from "components/BaseLayout"
import StatusCode from "components/common/StatusCode"
import ErrorPage from "components/ErrorPage"
import { loadModelAction } from "redux/helper/actions"
import { AppState } from "redux/reducer"
import { EntityType, selectById, selectProjectBySlug } from "redux/reducer/data"
import { I18nPage, includeDefaultNamespaces, withTranslation } from "services/i18n"
import { Routes, routeWithParams } from "services/routes"

const mapStateToProps = (state: AppState, { id, slug }) => ({
  project: id
    ? selectById(state, EntityType.PROJECT, id)
    : selectProjectBySlug(state, slug),
  request: state.requests.projectLoading,
})

const connector = connect(mapStateToProps)
type PageProps = ConnectedProps<typeof connector> & WithTranslation & {
  id: number,
  slug: string,
}

const ProjectApplicationPage: I18nPage<PageProps> = ({ project, request }) => {
  // @todo custom error message "project not found" etc.
  if (!project && !request.isLoading || project.state === ProjectState.DEACTIVATED) {
    return <StatusCode statusCode={404}>
      <ErrorPage statusCode={404} error={request.loadingError} />
    </StatusCode>
  }

  return <BaseLayout pageTitle={project && project.name ? project.name : "Bewerbung als Mitarbeiter"}>
    <Row>
      <Col>
        <h1>Bewerbung als Projektmitglied</h1>
        <p>
          @todo
        </p>
      </Col>
    </Row>
    {request.isLoading ? <Spinner /> :
      <Row>
        <Col sm={8}>
          {/* @todo projectView */}
          <p>
            {project.shortDescription}
          </p>
          <Link href={Routes.PROJECT_PAGE}
            as={routeWithParams(Routes.PROJECT_PAGE, { slug: project.slug || project.id })}
          >
            <a>Zum Projektprofil</a>
          </Link>
        </Col>
      </Row>
    }
  </BaseLayout >
}

ProjectApplicationPage.getInitialProps = ({ store, query }: NextJSContext) => {
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

export default connector(withTranslation(includeDefaultNamespaces())(ProjectApplicationPage))
