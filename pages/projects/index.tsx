import { WithTranslation } from "next-i18next"
import { NextJSContext } from "next-redux-wrapper"
import React from "react"
import { connect, ConnectedProps } from "react-redux"
import { Spinner } from "reactstrap"

import BaseLayout from "components/BaseLayout"
import PageError from "components/common/PageError"
import IdeaCarousel from "components/marketplace/IdeaCarousel"
import ProjectCarousel from "components/marketplace/ProjectCarousel"
import { loadMarketplaceAction } from "redux/actions/marketplace"
import { AppState } from "redux/reducer"
import { selectMarketplaceIdeas, selectMarketplaceProjects } from "redux/reducer/marketplace"
import { I18nPage, includeDefaultNamespaces, withTranslation } from "services/i18n"

const mapStateToProps = (state: AppState) => ({
  ideas: selectMarketplaceIdeas(state),
  projects: selectMarketplaceProjects(state),
  request: state.requests.projectsLoading,
})

const connector = connect(mapStateToProps)
type PageProps = ConnectedProps<typeof connector> & WithTranslation

const MarketPage: I18nPage<PageProps> = ({ ideas, projects, request, t }) => {
  return <BaseLayout pageTitle={t("page.projects.index.title")}>
    {request.isLoading
      ? <Spinner />
      : <>
        <PageError error={request.loadingError} />
        <IdeaCarousel projects={ideas} />
        <ProjectCarousel projects={projects} />
      </>
    }
  </BaseLayout>
}

MarketPage.getInitialProps = ({ store }: NextJSContext) => {
  const projectIds = store.getState().marketplace.projects
  if (!projectIds) {
    store.dispatch(loadMarketplaceAction())
  }

  return {
    namespacesRequired: includeDefaultNamespaces(),
  }
}

export default connector(withTranslation(includeDefaultNamespaces())(MarketPage))
