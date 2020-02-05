import { WithTranslation } from "next-i18next"
import { NextJSContext } from "next-redux-wrapper"
import Link from "next/link"
import React from "react"
import { connect, ConnectedProps } from "react-redux"
import { Col, Row, Spinner } from "reactstrap"

import { UserRole } from "api/schema"
import BaseLayout from "components/BaseLayout"
import PageError from "components/common/PageError"
import { withAuth } from "components/hoc/withAuth"
import EmptyProjectCard from "components/marketplace/EmptyProjectCard"
import MyProjectCard from "components/project/MyProjectCard"
import { loadMyProjectsAction } from "redux/actions/myProjects"
import { AppState } from "redux/reducer"
import { selectMyProjects, selectMyProjectsLoaded } from "redux/reducer/myProjects"
import { I18nPage, includeDefaultNamespaces, withTranslation } from "services/i18n"
import { Routes } from "services/routes"

const mapStateToProps = (state: AppState) => ({
  myProjects: selectMyProjects(state),
  myProjectsLoaded: selectMyProjectsLoaded(state),
  request: state.requests.projectsLoading,
})

const connector = connect(mapStateToProps)
type PageProps = ConnectedProps<typeof connector> & WithTranslation

const MyProjectsPage: I18nPage<PageProps> = ({ request, myProjects, myProjectsLoaded, t }) => {
  const noProjects: boolean = myProjectsLoaded && myProjects.length === 0
  const hasProjects: boolean = myProjectsLoaded && myProjects.length > 0

  const wrappedProjects = hasProjects
    ? myProjects.map((project) =>
      <MyProjectCard key={project.id} project={project} />)
    : ""

  // @todo error anzeigen
  return (
    <BaseLayout pageTitle={t("page.user.myProjects.title")}>
      <Row>
        <Col>
          {request.isLoading
            ? <Spinner />
            : <>
              <PageError error={request.loadingError} />

              {noProjects && <Link href={Routes.MARKETPLACE}>
                <a className="btn d-block d-flex justify-content-center">
                  <EmptyProjectCard />
                </a>
              </Link>}

              {hasProjects && <div>{wrappedProjects}</div>}
            </>
          }
        </Col>
      </Row>
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
