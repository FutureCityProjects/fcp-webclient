import { NextPageContext } from "next"
import { WithTranslation } from "next-i18next"
import React from "react"
import { connect, ConnectedProps } from "react-redux"
import { Col, Row, Spinner } from "reactstrap"

import { UserRole } from "api/schema"
import BaseLayout from "components/BaseLayout"
import PageError from "components/common/PageError"
import TranslatedHtml from "components/common/TranslatedHtml"
import { withAuth } from "components/hoc/withAuth"
import { loadCurrentUserAction } from "redux/actions/currentUser"
import { AppState } from "redux/reducer"
import { selectCurrentUser } from "redux/reducer/auth"
import { I18nPage, includeDefaultNamespaces, withTranslation } from "services/i18n"

const mapStateToProps = (state: AppState) => ({
  currentUser: selectCurrentUser(state),
  request: state.requests.userLoading,
})

const connector = connect(mapStateToProps)
type PageProps = ConnectedProps<typeof connector> & WithTranslation

const ProfilePage: I18nPage<PageProps> = ({ currentUser, request, t }) => {
  return <BaseLayout pageTitle={t("page.user.profile.title")}>
    <Row>
      <Col>
        {request.isLoading
          ? <Spinner />
          : !currentUser
            ? <PageError error={request.loadingError} />
            : <>
              <h1>{t("page.user.profile.heading", { username: currentUser.username })}</h1>
              <p><TranslatedHtml content="page.user.profile.intro" params={{ username: currentUser.username }} /></p>
              <p>Deine Email-Adresse: {currentUser.email}</p>
            </>
        }
      </Col>
    </Row>
  </BaseLayout>
}

ProfilePage.getInitialProps = ({ store }: NextPageContext) => {
  if (!selectCurrentUser(store.getState())) {
    store.dispatch(loadCurrentUserAction())
  }

  return { namespacesRequired: includeDefaultNamespaces() }
}

export default withAuth(
  connector(
    withTranslation(includeDefaultNamespaces())(ProfilePage),
  ),
  UserRole.User,
)
