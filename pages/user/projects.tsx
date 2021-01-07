import { NextPageContext } from "next"
import { WithTranslation } from "next-i18next"
import Link from "next/link"
import React from "react"
import { connect, ConnectedProps } from "react-redux"
import { Col, Row, Spinner } from "reactstrap"

import { IProject, IProjectMembership, UserRole } from "api/schema"
import BaseLayout from "components/BaseLayout"
import PageError from "components/common/PageError"
import { withAuth } from "components/hoc/withAuth"
import EmptyProjectCard from "components/marketplace/EmptyProjectCard"
import MyProjectCard from "components/project/MyProjectCard"
import { AnyAction, Dispatch } from "redux"
import { loadMyProjectsAction } from "redux/actions/myProjects"
import { deleteModelAction } from "redux/helper/actions"
import { AppState } from "redux/reducer"
import { EntityType } from "redux/reducer/data"
import { selectMyMemberships, selectMyProjects, selectMyProjectsLoaded } from "redux/reducer/myProjects"
import { I18nPage, includeDefaultNamespaces, withTranslation } from "services/i18n"
import { Routes } from "services/routes"

const mapDispatchToProps = (dispatch: Dispatch<AnyAction>) => ({
  deleteMembership: (membership: IProjectMembership, actions: any) =>
    dispatch(deleteModelAction(EntityType.ProjectMembership, membership, actions)),
})

const mapStateToProps = (state: AppState) => ({
  myProjects: selectMyProjects(state),
  myMemberships: selectMyMemberships(state),
  myProjectsLoaded: selectMyProjectsLoaded(state),
  request: state.requests.projectsLoading,
})

const connector = connect(mapStateToProps, mapDispatchToProps)
type PageProps = ConnectedProps<typeof connector> & WithTranslation

const MyProjectsPage: I18nPage<PageProps> = (props: PageProps) => {
  const { deleteMembership, myMemberships, myProjects, myProjectsLoaded, request, t } = props
  const noProjects: boolean = myProjectsLoaded && myProjects.length === 0
  const hasProjects: boolean = myProjectsLoaded && myProjects.length > 0

  const wrappedProjects = hasProjects
    ? myProjects.map((project) =>
      <MyProjectCard
        deleteMembership={deleteMembership}
        isSingle={myProjects.length === 1}
        key={project.id}
        project={project}
        membership={myMemberships && myMemberships.find((m) => (m.project as IProject).id === project.id)}
      />)
    : null

  // @todo error anzeigen
  return (
    <BaseLayout pageTitle={t("page.user.projects.title")}>
      <Row>
        <Col>
          {request.isLoading
            ? <Spinner />
            : <>
              <PageError error={request.loadingError} />

              {noProjects && <Link href={Routes.Marketplace}>
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

MyProjectsPage.getInitialProps = ({ store }: NextPageContext) => {
  if (!selectMyProjectsLoaded(store.getState())) {
    store.dispatch(loadMyProjectsAction())
  }

  return { namespacesRequired: includeDefaultNamespaces() }
}

export default withAuth(
  connector(
    withTranslation(includeDefaultNamespaces())(MyProjectsPage),
  ),
  UserRole.User,
)
