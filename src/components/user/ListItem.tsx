import Link from "next/link"
import React, { FunctionComponent } from "react"

import { IUser } from "api/schema"
import { Routes, routeWithParams } from "services/routes"

interface IProps {
  user: IUser
}

export const ListItem: FunctionComponent<IProps> = ({ user }: IProps) => (
  <tr>
    <th scope="row"><Link href={Routes.USER_DETAILS} as={routeWithParams(Routes.USER_DETAILS, { id: user.id })}>
      <a>
        {user["@id"]}
      </a>
    </Link></th>
    <td>{user.email}</td>
    <td>{user.roles.join(", ")}</td>
    <td>{user.username}</td>
    <td>
      <Link href={Routes.USER_DETAILS} as={routeWithParams(Routes.USER_DETAILS, { id: user.id })}>
        <a>
          Show
        </a>
      </Link>
    </td>
  </tr>
)
