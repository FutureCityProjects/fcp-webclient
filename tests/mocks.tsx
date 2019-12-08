import React from "react"

export const mockComponentWithChildren = () => jest.fn(({ children }) => <>{children} </>)
