import jwtDecode from "jwt-decode"

import { UserRole } from "api/schema"
import { IWebToken } from "redux/helper/state"

export interface IDecodedToken {
  readonly id: number
  readonly username: string
  readonly exp: number
  readonly roles: UserRole[]
}

export class AuthToken {
  public readonly decodedToken: IDecodedToken

  constructor(readonly token?: string) {
    this.decodedToken = { username: "", exp: 0, id: null, roles: [] }
    try {
      if (token) { this.decodedToken = jwtDecode(token) }
      // tslint:disable-next-line: no-empty
    } catch (e) { }
  }

  get expiresAt(): Date {
    return new Date(this.decodedToken.exp * 1000)
  }

  get isExpired(): boolean {
    return new Date() > this.expiresAt
  }

  get isAuthenticated(): boolean {
    return !this.isExpired
  }

  get authorizationString() {
    return `Bearer ${this.token}`
  }

  get jwt(): IWebToken {
    return {
      encoded: this.token,
      expiresAt: this.decodedToken.exp,
      id: this.decodedToken.id,
      roles: this.decodedToken.roles,
      username: this.decodedToken.username,
    }
  }
}
