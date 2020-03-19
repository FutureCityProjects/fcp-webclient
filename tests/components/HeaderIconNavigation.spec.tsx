import { fireEvent, render } from "@testing-library/react"
import React from "react"

import { UserRole } from "api/schema"
import HeaderIconNavigation from "../../src/components/layout/Header/HeaderIconNavigation"

// mock ActiveLink as it requires next/router and Icon as it requires react-inlinesvg which uses fetch()
// tslint:disable: no-var-requires
jest.mock("../../src/components/common/ActiveLink", require("../mocks").mockComponentWithChildren)
jest.mock("../../src/components/common/Icon", require("../mocks").mockComponentWithChildren)

jest.mock("popper.js", () => class {
  constructor() {
    return {
      destroy: jest.fn(),
      scheduleUpdate: jest.fn(),
      update: jest.fn(),
    }
  }
})

describe("Component:HeaderIconNavigation", () => {
  it("renders with given username, shows logout button and calls doLogout on click", () => {
    const loggedInAs = "PeterJackson1"
    const logout = jest.fn(() => null)

    const { queryByText } = render(<HeaderIconNavigation username={loggedInAs}
      doLogout={logout}
      roles={[UserRole.USER]} />)

    expect(queryByText("navigation.userProfile")).toBeInTheDocument()

    // contains the logout button
    const logoutButton = queryByText(/Logout/i)
    expect(logoutButton).toBeInTheDocument()

    // click on the logout button fires the given actionDispatch
    fireEvent.click(logoutButton)
    expect(logout.mock.calls.length).toBe(1)
  })
})
