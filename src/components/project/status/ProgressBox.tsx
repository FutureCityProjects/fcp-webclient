import Link from "next/link"
import React from "react"

import Icon from "components/common/Icon"
import { progressToText } from "components/project/ProgressText"
import { useTranslation } from "services/i18n"

const statusIcon = (complete) => complete
  ? <div aria-label="complete" className="progress-box-status-icon text-success">
    <Icon name="check" size={28} />
  </div>
  : <div aria-label="incomplete" className="progress-box-status-icon text-gray">
    <Icon name="check" size={28} />
  </div>

const boxClassName = (active: boolean) => "progress-box" + (active ? "" : " inactive")

interface IProps {
  active?: boolean
  as?: string | { pathname: string, query: any }
  complete?: boolean
  href?: string | { pathname: string, query: any }
  icon: string
  progress?: number
  subtitle: string
  title: string
}

const ProgressBox: React.FC<IProps> = (props: IProps) => {
  const { t } = useTranslation()
  const { as, active = true, complete = false, href, icon, progress, title, subtitle } = props
  const translatedTitle = t(title)

  const body = <div className="progress-box-body">
    <div><Icon name={icon} size={34} /></div>
    <div className="progress-box-text">
      <span className="project-milestone-prefix">{t(subtitle)}</span>
      <h4 className={"progress-box-title" + (translatedTitle.length > 7 && " title-smaller")}>{translatedTitle}</h4>
      <span className="progress-box-status">{t(progressToText(progress))}</span>
    </div>
    {statusIcon(complete)}
  </div>

  return href
    ? <Link href={href} as={as}>
      <a aria-label="progress" className={boxClassName(active)} >
        {body}
      </a >
    </Link >
    : <div className={href ? "" : boxClassName(active)}>{body}</div>
}

export default ProgressBox
