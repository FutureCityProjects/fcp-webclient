import jwtDecode from "jwt-decode"

import { IWebToken } from "redux/helper/state"

export interface IDecodedToken {
  readonly username: string
  readonly exp: number
  readonly roles: string[],
}

export class AuthToken {
  public readonly decodedToken: IDecodedToken

  constructor(readonly token?: string) {
    this.decodedToken = { username: "", exp: 0, roles: [] }
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
      roles: this.decodedToken.roles,
      username: this.decodedToken.username,
    }
  }
}
