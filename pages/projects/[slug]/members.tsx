import { NextPageContext } from "next"
import { WithTranslation } from "next-i18next"
import Link from "next/link"
import React from "react"
import { connect, ConnectedProps } from "react-redux"
import { Card, CardBody, CardHeader, Col, Row, Spinner } from "reactstrap"
import { AnyAction, Dispatch } from "redux"

import { IProjectMembership, IUser, MembershipRole, UserRole } from "api/schema"
import BaseLayout from "components/BaseLayout"
import Icon from "components/common/Icon"
import PageError from "components/common/PageError"
import StatusCode from "components/common/StatusCode"
import TranslatedHtml from "components/common/TranslatedHtml"
import ErrorPage from "components/ErrorPage"
import { withAuth } from "components/hoc/withAuth"
import { loadMyProjectsAction } from "redux/actions/myProjects"
import { deleteModelAction, updateModelAction } from "redux/helper/actions"
import { AppState } from "redux/reducer"
import { EntityType } from "redux/reducer/data"
import { selectIsProjectMember, selectIsProjectOwner, selectMyProjectByIdentifier } from "redux/reducer/myProjects"
import { I18nPage, includeDefaultNamespaces, withTranslation } from "services/i18n"
import { Routes } from "services/routes"

const mapDispatchToProps = (dispatch: Dispatch<AnyAction>) => ({
  deleteApplication: (application, actions) =>
    dispatch(deleteModelAction(EntityType.PROJECT_MEMBERSHIP, application, actions)),
  updateApplication: (application, actions) =>
    dispatch(updateModelAction(EntityType.PROJECT_MEMBERSHIP, application, actions)),
})

const mapStateToProps = (state: AppState, { slug }) => ({
  isMember: selectIsProjectMember(state, slug),
  isOwner: selectIsProjectOwner(state, slug),
  project: selectMyProjectByIdentifier(state, slug),
  projectRequest: state.requests.projectLoading,
  membershipRequest: state.requests.projectMembershipOperation,
})

const connector = connect(mapStateToProps, mapDispatchToProps)
type PageProps = ConnectedProps<typeof connector> & WithTranslation & {
  slug: string
}

const MembersPage: I18nPage<PageProps> = (props: PageProps) => {
  const { deleteApplication, isMember, isOwner, membershipRequest, project, projectRequest, t, updateApplication } = props

  // @todo custom error message "project not found or no permission" etc.
  if (!projectRequest.isLoading && (!project || project.isLocked
    || !isMember)
  ) {
    return <StatusCode statusCode={404}>
      <ErrorPage statusCode={404} error={projectRequest.loadingError} />
    </StatusCode>
  }

  const acceptApplication = (application: IProjectMembership) => {
    updateApplication({ ...application, role: MembershipRole.MEMBER }, {})

    return false
  }

  const rejectApplication = (application: IProjectMembership) => {
    // add the project to the application so the saga can properly trigger the project update
    deleteApplication({ ...application, project }, {})

    return false
  }

  return <BaseLayout pageTitle={t("page.projects.members.title")}>
    <Row>
      <Col>
        <h1>{t("page.projects.members.heading")}</h1>
        {(projectRequest.isLoading)
          ? <Spinner />
          : <>
            <p><TranslatedHtml content="page.projects.members.intro" params={{ projectName: project.name }} /></p>
            <Link
              href={Routes.MY_PROJECTS}
              as={Routes.MY_PROJECTS + "#project-" + project.id}
            >
              <a className="btn btn-secondary btn-sm">{t("goto.myProjects")}</a>
            </Link>
          </>
        }

        <PageError error={projectRequest.loadingError || membershipRequest.loadingError} />
      </Col>
    </Row>

    {(!projectRequest.isLoading) && <Row>
      {project.memberships
        .sort(((a, b) => (a.user as IUser).username > (b.user as IUser).username
          ? 1
          : (a.user as IUser).username < (b.user as IUser).username ? -1 : 0))
        .map((membership) => <Col key={membership["@id"]}>
          <Card className="body-card">
            <CardHeader>
              <h3>{(membership.user as IUser).username} {membership.role !== MembershipRole.MEMBER && <>
                <span className="small">({t("project.membership." + membership.role)})</span>
              </>}
              </h3>
              {isOwner && <div role="actions" className="icon-navigation">
                {membership.role === MembershipRole.APPLICANT && <>
                  <a
                    aria-label={t("page.projects.members.acceptApplication")}
                    className="navigation-item"
                    title={t("page.projects.members.acceptApplication")}
                    onClick={() => { acceptApplication(membership); return false }}
                  >
                    <Icon name={"plus"} size={24} />
                  </a>
                  <a
                    aria-label={t("page.projects.members.rejectApplication")}
                    className="navigation-item"
                    title={t("page.projects.members.rejectApplication")}
                    onClick={() => { rejectApplication(membership); return false }}
                  >
                    <Icon name={"trash"} size={24} />
                  </a>
                </>}
              </div>}
            </CardHeader>
            <CardBody>
              <h5>{t("project.membership.motivation")}</h5>
              {membership.motivation}
              <h5>{t("project.membership.skills")}</h5>
              {membership.skills}
            </CardBody>
          </Card>
        </Col>)}
    </Row>}
  </BaseLayout>
}

MembersPage.getInitialProps = ({ store, query }: NextPageContext) => {
  const state = store.getState()

  // slug could also be the ID
  const slug: string = typeof query.slug === "string" ? query.slug : null
  if (slug && !selectMyProjectByIdentifier(state, slug)) {
    store.dispatch(loadMyProjectsAction())
  }

  return { slug, namespacesRequired: includeDefaultNamespaces() }
}

export default withAuth(
  connector(
    withTranslation(includeDefaultNamespaces())(MembersPage),
  ),
  UserRole.USER,
)
