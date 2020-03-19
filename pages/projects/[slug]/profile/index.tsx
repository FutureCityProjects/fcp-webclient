import { NextPageContext } from "next"
import { WithTranslation } from "next-i18next"
import React from "react"
import { connect, ConnectedProps } from "react-redux"
import { Col, Row, Spinner } from "reactstrap"

import { UserRole } from "api/schema"
import BaseLayout from "components/BaseLayout"
import StatusCode from "components/common/StatusCode"
import TranslatedHtml from "components/common/TranslatedHtml"
import ErrorPage from "components/ErrorPage"
import { withAuth } from "components/hoc/withAuth"
import ProfileView from "components/project/profile/ProfileView"
import { loadMyProjectsAction } from "redux/actions/myProjects"
import { AppState } from "redux/reducer"
import { selectIsProjectMember, selectMyProjectByIdentifier } from "redux/reducer/myProjects"
import { I18nPage, includeDefaultNamespaces, withTranslation } from "services/i18n"

const mapStateToProps = (state: AppState, { slug }) => ({
  isMember: selectIsProjectMember(state, slug),
  project: selectMyProjectByIdentifier(state, slug),
  request: state.requests.projectsLoading,
})

const connector = connect(mapStateToProps)
type PageProps = ConnectedProps<typeof connector> & WithTranslation & {
  slug: string,
}

const ProjectProfilePage: I18nPage<PageProps> = ({ isMember, project, request, t }) => {
  // @todo custom error message "project not found or no permission" etc.
  if (!request.isLoading && (!project || project.isLocked || !isMember)) {
    return <StatusCode statusCode={404}>
      <ErrorPage statusCode={404} error={request.loadingError} />
    </StatusCode>
  }

  return <BaseLayout pageTitle={t("page.projects.profile.index.title")}>
    <Row>
      <Col>
        <h1>{t("page.projects.profile.index.heading")}</h1>
        <p><TranslatedHtml content="page.projects.profile.index.intro" /></p>
      </Col>
    </Row>

    <Row>
      <Col>
        {request.isLoading ? <Spinner /> :
          <ProfileView project={project} />
        }
      </Col>
    </Row>
  </BaseLayout >
}

ProjectProfilePage.getInitialProps = ({ store, query }: NextPageContext) => {
  // slug could also be the ID
  const slug: string = typeof query.slug === "string" ? query.slug : null
  if (slug && !selectMyProjectByIdentifier(store.getState(), slug)) {
    store.dispatch(loadMyProjectsAction())
  }

  return { slug, namespacesRequired: includeDefaultNamespaces() }
}

export default withAuth(
  connector(
    withTranslation(includeDefaultNamespaces())(ProjectProfilePage),
  ),
  UserRole.USER,
)
