import get from "lodash/get"
import has from "lodash/has"
import React, { useState } from "react"
import { Dropdown, DropdownItem, DropdownMenu, DropdownToggle } from "reactstrap"

interface IProps {
  button: any
  className?: any
  light?: boolean
  title?: string
}

const DropdownComponent: React.FC<IProps> = (props) => {
  const wrappedChildren = React.Children.map(props.children, (child, i) => {
    // fix react error: items in a list must have a key
    const key = has(child, "key") ? `key-${get(child, "key")}` : `index-${i}`

    return <>{child &&
      <DropdownItem key={key}>
        {child}
      </DropdownItem>
    }</>
  })

  const [isOpen, setIsOpen] = useState(false)
  const toggle = () => setIsOpen(!isOpen)

  return <>
    <Dropdown className={props.className} isOpen={isOpen} toggle={toggle} title={props.title}>
      <DropdownToggle children={props.button} />
      <DropdownMenu className={props.light ? "dropdown-menu-light" : ""} right >
        {wrappedChildren}
      </DropdownMenu>
    </Dropdown>
  </>
}

export default DropdownComponent
