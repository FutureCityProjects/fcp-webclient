import { fireEvent, render } from "@testing-library/react"
import React from "react"

import Navigation from "../../src/components/common/Navigation"

// tslint:disable: no-var-requires
jest.mock("../../src/components/common/ActiveElement", require("../mocks").mockComponentWithChildren)
jest.mock("../../src/components/common/ActiveLink", require("../mocks").mockComponentWithChildren)

describe("Component:Navigation", () => {
  it("renders with given username, shows logout button and calls doLogout on click", () => {
    const loggedInAs = "PeterJackson1"
    const logout = jest.fn(() => null)

    const { queryByText } = render(<Navigation username={loggedInAs} doLogout={logout} />)

    // shows the username
    expect(queryByText(loggedInAs)).toBeInTheDocument()

    // contains the logout button
    const logoutButton = queryByText(/Logout/i)
    expect(logoutButton).toBeInTheDocument()

    // click on the logout button fires the given actionDispatch
    fireEvent.click(logoutButton)
    expect(logout.mock.calls.length).toBe(1)
  })
})
