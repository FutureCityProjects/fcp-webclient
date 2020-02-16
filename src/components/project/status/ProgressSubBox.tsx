import Link from "next/link"
import React from "react"

interface IProps {
  href: string
  title: string
}

const ProgressSubBox: React.FC<IProps> = (props: IProps) =>
  <Link href={props.href}>
    <a className="sub-status-card">
      <h3>
        {props.title}
      </h3>
    </a>
  </Link>

export default ProgressSubBox
