import { IProject } from "api/schema"
import React from "react"

import WorkPackageCard from "./WorkPackageCard"

interface IProps {
  onDelete: any,
  onEdit: any,
  onTaskDelete: any
  onTaskAssign: any,
  project: IProject,
}

const WordPackageCardContainer: React.FC<IProps> = (props: IProps) => {
  const { project, onEdit, onDelete, onTaskAssign, onTaskDelete } = props

  const currentPackages = project.workPackages.map((wp) => <WorkPackageCard
    currentPackage={wp.id}
    key={wp.id}
    onEdit={onEdit}
    onDelete={onDelete}
    onTaskAssign={onTaskAssign}
    onTaskDelete={onTaskDelete}
    project={project}
  />)

  return <>{currentPackages}</>
}

export default WordPackageCardContainer
