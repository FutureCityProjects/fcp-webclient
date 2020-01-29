import { WithTranslation } from "next-i18next"
import { NextJSContext } from "next-redux-wrapper"
import React from "react"
import { connect, ConnectedProps } from "react-redux"
import { Col, Row, Spinner } from "reactstrap"

import { UserRole } from "api/schema"
import BaseLayout from "components/BaseLayout"
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

const ProfilePage: I18nPage<PageProps> = ({ currentUser, request }) => {
  return <BaseLayout pageTitle="Dein Profil">
    <Row>
      <Col>
        <h1>Profil</h1>
        {request.loadingError && <p className="text-danger">{request.loadingError}</p>}

        {currentUser
          ? <>
            <p>Hallo {currentUser.username}!</p>
            <p>Deine Email-Adresse: {currentUser.email}</p>
          </>
          : <Spinner />
        }
      </Col>
    </Row>
  </BaseLayout>
}

ProfilePage.getInitialProps = ({ store }: NextJSContext) => {
  if (!selectCurrentUser(store.getState())) {
    store.dispatch(loadCurrentUserAction())
  }

  return { namespacesRequired: includeDefaultNamespaces() }
}

export default withAuth(
  connector(
    withTranslation(includeDefaultNamespaces())(ProfilePage),
  ),
  UserRole.USER,
)
