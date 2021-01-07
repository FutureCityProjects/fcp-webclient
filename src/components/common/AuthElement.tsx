import React, { FunctionComponent } from "react"

import { UserRole } from "api/schema"

interface IProps {
  requiredRole: UserRole
  roles: string[]
}

const AuthElement: FunctionComponent<IProps> = ({ children, requiredRole, roles }) => {
  if (roles.includes(requiredRole)) {
    return <>{children}</>
  }

  if (requiredRole === UserRole.GUEST && !roles.includes(UserRole.USER)) {
    return <>{children}</>
  }

  return null
}

export default AuthElement
