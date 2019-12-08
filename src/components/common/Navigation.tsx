import Link from "next/link"
import React, { useState } from "react"
import {
  Button,
  Collapse,
  DropdownItem,
  DropdownMenu,
  DropdownToggle,
  Nav,
  Navbar,
  NavbarToggler,
  NavItem,
  NavLink,
  UncontrolledDropdown,
} from "reactstrap"
import ActiveElement from "./ActiveElement"
import ActiveLink from "./ActiveLink"

interface IProps {
  username: string
  doLogout: () => void
}

function Navigation({ username, doLogout }: IProps) {
  const [isOpen, setIsOpen] = useState(false)
  const toggle = () => setIsOpen(!isOpen)

  return (

    <Navbar color="dark" dark expand="md" fixed="top">

      <Link href="/"><a className="navbar-brand">FCP</a></Link>

      <NavbarToggler onClick={toggle} />
      <Collapse isOpen={isOpen} navbar>
        <Nav className="ml-auto" navbar>
          <NavItem>
            <ActiveLink href="/dashboard">
              <NavLink>Dashboard</NavLink>
            </ActiveLink>
          </NavItem>
          <NavItem>
            <ActiveLink href="/process">
              <NavLink>Process</NavLink>
            </ActiveLink>
          </NavItem>
          <NavItem>
            <ActiveLink href="/process/create">
              <NavLink>Create Process</NavLink>
            </ActiveLink>
          </NavItem>
          <UncontrolledDropdown nav inNavbar>
            <ActiveElement href="/users">
              <DropdownToggle nav caret>
                Users
              </DropdownToggle>
            </ActiveElement>
            <DropdownMenu right>
              <ActiveLink href="/users">
                <DropdownItem>
                  List
                </DropdownItem>
              </ActiveLink>
              <ActiveLink href="/users/[id]" as="/users/16">
                <DropdownItem>
                  Jakob
                </DropdownItem>
              </ActiveLink>
            </DropdownMenu>
          </UncontrolledDropdown>
        </Nav>

        <Nav className="ml-auto" navbar>
          {username
            ? <>
              <NavItem>
                <ActiveLink href="/profile">
                  <NavLink>{username}</NavLink>
                </ActiveLink>
              </NavItem>
              <NavItem><Button onClick={doLogout}>Logout</Button></NavItem>
            </>
            : <NavItem>
              <ActiveLink href="/login">
                <NavLink>Login</NavLink>
              </ActiveLink>
            </NavItem>
          }
        </Nav>
      </Collapse>
    </Navbar>
  )
}

export default Navigation
