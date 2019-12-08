import React from "react"

import { IWebToken } from "redux/helper/state"
import { initialAuthState } from "redux/reducer/auth"
import Layout from "../../src/components/Layout"
import { getInitialState, renderWithRedux } from "../helpers"

// tslint:disable: no-var-requires
jest.mock("../../src/components/common/ActiveElement", require("../mocks").mockComponentWithChildren)
jest.mock("../../src/components/common/ActiveLink", require("../mocks").mockComponentWithChildren)

describe("Component:Layout", () => {
  test("renders children with initial state", () => {
    const testMessage = "Test Message"
    const { getByText, queryByText } = renderWithRedux(<Layout><span>{testMessage}</span></Layout>)

    // renders any passed content
    expect(getByText(testMessage)).toBeInTheDocument()

    // renders a login (and no logout) button (initialstate contains no user)
    expect(queryByText(/Login/i)).toBeInTheDocument()
    expect(queryByText(/Logout/i)).not.toBeInTheDocument()

    // renders the additional layout elements
    expect(queryByText((_, element) => element.tagName.toLowerCase() === "header")).toBeInTheDocument()
    expect(queryByText((_, element) => element.tagName.toLowerCase() === "footer")).toBeInTheDocument()
  })

  test("renders navigation with login state", () => {
    const token: IWebToken = { encoded: "fakeJWT", username: "PeterJackson1", expiresAt: 0, roles: [] }
    const initialstate = {
      ...getInitialState(),
      auth: {
        ...initialAuthState,
        token,
      },
    }

    const { getByText, queryByText } = renderWithRedux(
      <Layout><span>with User</span></Layout>,
      initialstate,
    )

    // contains the logged in user
    expect(getByText(token.username)).toBeInTheDocument()

    // renders a logout (and no login) button (initialstate contains no user)
    expect(queryByText(/Logout/i)).toBeInTheDocument()
    expect(queryByText(/Login/i)).not.toBeInTheDocument()
  })
})
