import { NextPageContext } from "next"
import { WithTranslation } from "next-i18next"
import React from "react"
import { connect, ConnectedProps } from "react-redux"
import { Col, Row, Spinner } from "reactstrap"

import { UserRole } from "api/schema"
import BaseLayout from "components/BaseLayout"
import StatusCode from "components/common/StatusCode"
import ErrorPage from "components/ErrorPage"
import { withAuth } from "components/hoc/withAuth"
import { List } from "components/user/List"
import { loadCollectionAction } from "redux/helper/actions"
import { AppState } from "redux/reducer"
import { EntityType, selectCollection } from "redux/reducer/data"
import { I18nPage, includeDefaultNamespaces, withTranslation } from "services/i18n"
import { REQUEST_ERRORS } from "services/requestError"

const mapStateToProps = (state: AppState) => ({
  // @todo user custom reducer to track users loaded with admin privileges
  request: state.requests.usersLoading,
  users: selectCollection(state, EntityType.USER),
})

const connector = connect(mapStateToProps)
type PageProps = ConnectedProps<typeof connector> & WithTranslation

const UserAdministrationPage: I18nPage<PageProps> = ({ request, users }: PageProps) => {
  if (!request.isLoading && request.loadingError) {
    let code = 500
    let error: string = null
    switch (request.loadingError) {
      case REQUEST_ERRORS.BAD_REQUEST:
        code = 400
        break

      case REQUEST_ERRORS.NOT_FOUND:
        code = 404
        break

      default:
        error = request.loadingError
        break
    }
    return <StatusCode statusCode={code}>
      <ErrorPage statusCode={code} error={error} />
    </StatusCode>
  }

  return <BaseLayout pageTitle="Benutzerdetails">
    <Row>
      <Col>
        {request.isLoading
          ? <Spinner />
          : <List users={users} />
        }
      </Col>
    </Row>
  </BaseLayout>
}

UserAdministrationPage.getInitialProps = async ({ store }: NextPageContext) => {
  // @todo custom reducer to track the management list, else
  // only the current user will be shown
  if (selectCollection(store.getState(), EntityType.USER).length <= 0) {
    store.dispatch(loadCollectionAction(EntityType.USER, {}, "user_management"))
  }

  return { namespacesRequired: includeDefaultNamespaces() }
}

export default withAuth(
  connector(
    withTranslation(includeDefaultNamespaces())(UserAdministrationPage),
  ),
  UserRole.ADMIN,
)
