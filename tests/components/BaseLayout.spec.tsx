import React from "react"

import { UserRole } from "api/schema"
import { IWebToken } from "redux/helper/state"
import BaseLayout from "../../src/components/BaseLayout"
import { getInitialState, renderWithRedux } from "../helpers"

// mock ActiveLink as it requires next/router and Icon as it requires react-inlinesvg which uses fetch()
// tslint:disable: no-var-requires
jest.mock("../../src/components/common/ActiveLink", require("../mocks").mockComponentWithChildren)
jest.mock("../../src/components/common/Icon", require("../mocks").mockComponentWithChildren)

describe("Component:BaseLayout", () => {
  test("renders children with initial state", () => {
    const testMessage = "Test Message"
    const { getByText, queryByText } = renderWithRedux(
      <BaseLayout pageTitle="Test"><span>{testMessage}</span></BaseLayout>,
    )

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
    const token: IWebToken = {
      encoded: "fakeJWT", username: "PeterJackson1",
      expiresAt: 0, id: 0, roles: [UserRole.User]
    }
    const initialstate = {
      ...getInitialState(),
      auth: token,
    }

    const { getByText, queryByText } = renderWithRedux(
      <BaseLayout pageTitle="Test"><span>with User</span></BaseLayout>,
      initialstate,
    )

    expect(getByText("navigation.userProfile")).toBeInTheDocument()

    // renders a logout (and no login) button (initialstate contains no user)
    expect(queryByText(/Logout/i)).toBeInTheDocument()
    expect(queryByText(/Login/i)).not.toBeInTheDocument()
  })
})
