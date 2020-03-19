import { NextPageContext } from "next"
import { WithTranslation } from "next-i18next"
import React from "react"
import { connect, ConnectedProps } from "react-redux"
import { Spinner } from "reactstrap"

import { UserRole } from "api/schema"
import BaseLayout from "components/BaseLayout"
import StatusCode from "components/common/StatusCode"
import ErrorPage from "components/ErrorPage"
import { withAuth } from "components/hoc/withAuth"
import { Show } from "components/user/Show"
import { loadModelAction } from "redux/helper/actions"
import { AppState } from "redux/reducer"
import { EntityType, selectById } from "redux/reducer/data"
import { I18nPage, includeDefaultNamespaces, withTranslation } from "services/i18n"
import { REQUEST_ERRORS } from "services/requestError"

const mapStateToProps = (state: AppState, { id }) => ({
  // @todo use custom reducer to keep track of the loaded users to know if we loaded with
  // admin privileges or if the user was in state from a public page etc.
  request: state.requests.userLoading,
  user: selectById(state, EntityType.USER, id),
})

const connector = connect(mapStateToProps)
type PageProps = ConnectedProps<typeof connector> & WithTranslation & {
  id: any,
}

const UserDetailPage: I18nPage<PageProps> = ({ id, request, user }) => {
  if (!id || id <= 0) {
    return <StatusCode statusCode={400}>
      <ErrorPage statusCode={400} error={"failure.invalidRequest"} />
    </StatusCode>
  }

  if (!request.isLoading && request.loadingError) {
    let code: number = 500
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

  return <BaseLayout pageTitle="Benutzerliste">
    {request.isLoading
      ? <Spinner />
      : <Show user={user} />
    }
  </BaseLayout>
}

UserDetailPage.getInitialProps = ({ store, query }: NextPageContext) => {
  const id = parseInt(query.id as string, 10)

  // @todo use custom reducer to keep track of users loaded with admin privileges
  if (id > 0 && !selectById(store.getState(), EntityType.USER, id)) {
    store.dispatch(loadModelAction(EntityType.USER, { id }, "user_management"))
  }

  return { id, namespacesRequired: includeDefaultNamespaces() }
}

export default withAuth(
  connector(
    withTranslation(includeDefaultNamespaces())(UserDetailPage),
  ),
  UserRole.ADMIN,
)
