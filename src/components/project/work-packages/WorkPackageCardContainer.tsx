import React from "react"

import { IProject } from "api/schema"
import { IPlanFunctions } from "components/project/common/PlanContainer"
import WorkPackageCard from "./WorkPackageCard"

interface IProps {
  functions: IPlanFunctions
  project: IProject
}

const WordPackageCardContainer: React.FC<IProps> = ({ functions, project }: IProps) => <>
  {project.workPackages.map((wp) => <WorkPackageCard
    currentPackage={wp}
    functions={functions}
    key={wp.id}
    project={project}
  />)}
</>

export default WordPackageCardContainer
