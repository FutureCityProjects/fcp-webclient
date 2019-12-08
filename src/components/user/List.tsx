import React, { FunctionComponent } from "react"

import { IUser } from "api/schema"
import { ListItem } from "./ListItem"

interface IProps {
  users: IUser[]
}

export const List: FunctionComponent<IProps> = ({ users }) => (
  <div>
    <h1>User List</h1>
    <table className="table table-responsive table-striped table-hover">
      <thead>
        <tr>
          <th>id</th>
          <th>email</th>
          <th>roles</th>
          <th>username</th>
          <th />
        </tr>
      </thead>
      <tbody>
        {users && users.length && users.map((user) => (
          <ListItem key={user["@id"]} user={user} />
        ))}
      </tbody>
    </table>
  </div>
)
