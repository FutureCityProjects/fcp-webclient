import { NextJSContext } from "next-redux-wrapper"
import React, { useEffect, useRef, useState } from "react"
import { connect, ConnectedProps } from "react-redux"
import { AnyAction, Dispatch } from "redux"

import { ICredentials } from "api/schema"
import Layout from "components/Layout"
import { loginAction } from "redux/actions/auth"
import { AppState } from "redux/store"
import { nextI18next } from "services/i18n"
import { I18nPage, includeDefaultNamespaces } from "services/i18n"

const mapDispatchToProps = (dispatch: Dispatch<AnyAction>) => ({
  doLogin: (credentials: ICredentials, redirectBack?: string) =>
    dispatch(loginAction(credentials, redirectBack)),
})

const mapStateToProps = (state: AppState) => state.auth

const connector = connect(mapStateToProps, mapDispatchToProps)
type PageProps = ConnectedProps<typeof connector> & {
  redirectBack?: string,
}

const Page: I18nPage<PageProps> = (props: PageProps) => {
  const { t, i18n } = nextI18next.useTranslation()

  const initialValues: ICredentials = { username: "", password: "" }
  const [inputs, setInputs] = useState(initialValues)

  // useRef + componentDidMount hook to be compatible with firefox's autofill
  const emailInput = useRef(null)
  const passwordInput = useRef(null)
  useEffect(() => {
    setInputs({ username: emailInput.current.value, password: passwordInput.current.value })
  }, [emailInput, passwordInput])

  const handleSubmit = async (e: any) => {
    e.preventDefault()
    props.doLogin(inputs, props.redirectBack)
  }

  const handleInputChange = (e: React.ChangeEvent<any>) => {
    e.persist()

    setInputs({
      ...inputs,
      [e.target.name]: e.target.value,
    })
  }

  return <Layout title="Einloggen">
    <div className="row">
      <div className="col-lg">
        {props.error ? <p>Error: {props.error}</p> : null}

        <form className="container mx-auto max-w-sm" onSubmit={handleSubmit}>
          <div>
            <label htmlFor="username">Username or Email</label>
            <input type="text" id="username" name="username" autoComplete="on"
              onChange={handleInputChange} ref={emailInput} placeholder="your username" />
          </div>
          <div>
            <label htmlFor="password">Password</label>
            <input type="password" id="password" name="password" autoComplete="on"
              onChange={handleInputChange} ref={passwordInput} placeholder="your password" />
          </div>
          <button type="submit">Login</button>
        </form>
      </div>
      <p>{t("error-without-status")}</p>
      <p>{i18n.language}</p>
    </div>
  </Layout>
}

Page.getInitialProps = async ({ query, store }: NextJSContext) => {
  return {
    ...mapStateToProps(store.getState()),
    ...mapDispatchToProps(store.dispatch),
    namespacesRequired: includeDefaultNamespaces(),
    redirectBack: query.redirectBack,
  }
}

export default connector(Page)
