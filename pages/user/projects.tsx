import { WithTranslation } from "next-i18next"
import { NextJSContext } from "next-redux-wrapper"
import React from "react"
import { connect, ConnectedProps } from "react-redux"
import { Spinner } from "reactstrap"

import { UserRole } from "api/schema"
import BaseLayout from "components/BaseLayout"
import { withAuth } from "components/hoc/withAuth"
import MyProjectCard from "components/project/MyProjectCard"
import { loadMyProjectsAction } from "redux/actions/myProjects"
import { AppState } from "redux/reducer"
import { selectMyProjects, selectMyProjectsLoaded } from "redux/reducer/myProjects"
import { I18nPage, includeDefaultNamespaces, withTranslation } from "services/i18n"

const mapStateToProps = (state: AppState) => ({
  myProjects: selectMyProjects(state),
  myProjectsLoaded: selectMyProjectsLoaded(state),
  request: state.requests.projectsLoading,
})

const connector = connect(mapStateToProps)
type PageProps = ConnectedProps<typeof connector> & WithTranslation

const MyProjectsPage: I18nPage<PageProps> = ({ request, myProjects, myProjectsLoaded }) => {
  const noProjects: boolean = myProjectsLoaded && myProjects.length === 0
  const hasProjects: boolean = myProjectsLoaded && myProjects.length > 0

  const wrappedProjects = hasProjects
    ? myProjects.map((project) =>
      <MyProjectCard key={project.id} project={project} />)
    : ""

  // @todo error anzeigen
  return (
    <BaseLayout pageTitle="Meine Projekte">
      {request.isLoading
        ? <Spinner />
        : <>
          {request.loadingError && <p className="text-danger">{request.loadingError}</p>}
          {noProjects && <div>No own projects</div>}
          {hasProjects && <div>{wrappedProjects}</div>}
        </>
      }
    </BaseLayout>
  )
}

MyProjectsPage.getInitialProps = ({ store }: NextJSContext) => {
  if (!selectMyProjectsLoaded(store.getState())) {
    store.dispatch(loadMyProjectsAction())
  }

  return { namespacesRequired: includeDefaultNamespaces() }
}

export default withAuth(
  connector(
    withTranslation(includeDefaultNamespaces())(MyProjectsPage),
  ),
  UserRole.USER,
)
