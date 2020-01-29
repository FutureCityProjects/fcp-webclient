import Link from "next/link"
import React, { FunctionComponent } from "react"

import { IUser } from "api/schema"
import { Routes } from "services/routes"

interface IProps {
  user: IUser
}

export const Show: FunctionComponent<IProps> = ({ user }) => (
  <div>
    <h1>Show {user["@id"]}</h1>
    <table className="table table-responsive table-striped table-hover">
      <thead>
        <tr>
          <th>Field</th>
          <th>Value</th>
        </tr>
      </thead>
      <tbody>
        <tr>
          <th scope="row">email</th>
          <td>{user.email}</td>
        </tr>
        <tr>
          <th scope="row">roles</th>
          <td>{user.roles.join(", ")}</td>
        </tr>
        <tr>
          <th scope="row">username</th>
          <td>{user.username}</td>
        </tr>
      </tbody>
    </table>
    <Link href={Routes.USER_OVERVIEW}>
      <a className="btn btn-primary">
        Back to list
      </a>
    </Link>
  </div>
)
