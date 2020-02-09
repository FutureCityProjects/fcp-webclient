import React, { useState } from "react"
import uuidv1 from "uuid/v1"

import { IProject, IProjectTask, IRessourceRequirement, IWorkPackage } from "api/schema"

export interface IPlanFunctions {
  addResourceRequirement: any
  addTask: any
  addWorkPackage: any
  getIDs: any
  getResourceRequirement: any
  getResourceRequirements: any
  getTask: any
  getTasks: any
  getTaskResourceRequirements: any
  getWorkPackage: any
  getWorkPackages: any
  getWorkPackageTasks: any
  getWorkPackageResourceRequirements: any
  removeResourceRequirement: any
  removeTask: any
  removeWorkPackage: any
  sortResourceRequirements,
  sortTasks,
  sortWorkPackages,
  sumResourceRequirementCosts: any
  updateResourceRequirement: any
  updateTask: any
  updateWorkPackage: any
}

export interface IPlanProps {
  functions?: IPlanFunctions
  project?: IProject
  updateProject?: any
}

interface IProps {
  component: React.FC<IPlanProps>
  project: IProject
  updateProject: any
}

/**
 * Re-useable component to manage the projects plan including tasks, workPackages
 * and resource requirements
 *
 * Not as abstract class because of: We strongly recommend against creating your own base
 * component classes. In React components, code reuse is primarily achieved through
 * composition rather than inheritance.
 * @see https://reactjs.org/docs/react-component.html
 *
 * @param props IPlanProps
 */
const PlanContainer: React.FC<IProps> = (props: IProps) => {
  const [project, setProject] = useState(props.project)
  const getIDs = (list: any[]): string[] => list.map((e) => e.id)

  const getTasks = (): IProjectTask[] =>
    project.tasks || []
  const getTask = (id: string): IProjectTask =>
    getTasks().find((t) => t.id === id)
  const sortTasks = (list: IProjectTask[]): IProjectTask[] =>
    list.sort((a, b) => a.description.toLowerCase() > b.description.toLowerCase() ? 1 : -1)

  const getWorkPackages = (): IWorkPackage[] =>
    project.workPackages || []
  const getWorkPackage = (id: string): IWorkPackage =>
    getWorkPackages().find((w) => w.id === id)
  const getWorkPackageTasks = (id: string) =>
    getTasks().filter((t) => id ? t.workPackage === id : !t.workPackage)
  const sortWorkPackages = (list: IWorkPackage[]): IWorkPackage[] =>
    list.sort((a, b) => a.order > b.order ? 1 : -1)

  const getResourceRequirements = (): IRessourceRequirement[] =>
    project.resourceRequirements || []
  const getResourceRequirement = (id: string): IRessourceRequirement =>
    getResourceRequirements().find((r) => r.id === id)
  const getTaskResourceRequirements = (id: string): IRessourceRequirement[] =>
    getResourceRequirements().filter((r) => r.task === id)
  const getWorkPackageResourceRequirements = (id: string): IRessourceRequirement[] => {
    const ids = getIDs(getWorkPackageTasks(id))
    return (project.resourceRequirements || []).filter((r) => ids.includes(r.task))
  }
  const sortResourceRequirements = (list: IRessourceRequirement[]): IRessourceRequirement[] =>
    list.sort((a, b) => a.description.toLowerCase() > b.description.toLowerCase() ? 1 : -1)

  const sumResourceRequirementCosts = (requirements: IRessourceRequirement[]): number =>
    requirements.reduce((s, r) => s + (r.cost || 0), 0)

  const addResourceRequirement = (resource: IRessourceRequirement) => {
    resource.id = uuidv1()
    setProject({ ...project, resourceRequirements: [...getResourceRequirements(), resource] })
  }
  const updateResourceRequirement = (resource: IRessourceRequirement) => {
    const updatedResources = getResourceRequirements()
      .map((r) => r.id === resource.id ? resource : r)
    setProject({ ...project, resourceRequirements: updatedResources })
  }
  const removeResourceRequirement = (id: string) => {
    setProject({
      ...project,
      resourceRequirements: getResourceRequirements().filter((r) => r.id !== id)
    })
  }

  const addTask = (task: IProjectTask) => {
    task.id = uuidv1()
    setProject({ ...project, tasks: [task, ...getTasks()] })
  }
  const updateTask = (task: IProjectTask) => {
    const updatedTasks = getTasks().map((t) => t.id === task.id ? task : t)
    setProject({ ...project, tasks: updatedTasks })
  }
  const removeTask = (id: string) => {
    const hasReqs = getTaskResourceRequirements(id).length > 0
    if (hasReqs) {
      if (!confirm("Wirklich löschen, hat Res?")) {
        return
      }
    }

    // also delete all assigned resourceRequirements
    const updatedReqs = (project.resourceRequirements || []).filter((r) => r.task !== id)

    setProject({
      ...project,
      resourceRequirements: updatedReqs,
      tasks: getTasks().filter((t) => t.id !== id)
    })
  }

  const addWorkPackage = (wp: IWorkPackage) => {
    wp.id = uuidv1()
    wp.order = getWorkPackages().length + 1
    setProject({ ...project, workPackages: [...getWorkPackages(), wp] })
  }
  const updateWorkPackage = (wp: IWorkPackage) => {
    const updatedPackages = getWorkPackages().map((w) => w.id === wp.id ? wp : w)
    setProject({ ...project, workPackages: updatedPackages })
  }
  const removeWorkPackage = (id: string) => {
    const hasTasks = getWorkPackageTasks(id).length > 0
    if (hasTasks) {
      if (!confirm("Wirklich löschen, hat Tasks?")) {
        return
      }
    }

    // reset all tasks in this package to unassigned
    const updatedTasks = getTasks().map((t) => t.workPackage === id
      ? { ...t, workPackage: null }
      : t
    )

    // remove the package
    let updatedPackages = sortWorkPackages(getWorkPackages().filter((w) => w.id !== id))
    // redistribute order
    updatedPackages = updatedPackages.map((w, i) => ({ ...w, order: i + 1 }))

    setProject({
      ...project,
      tasks: updatedTasks,
      workPackages: updatedPackages
    })
  }

  return <props.component
    functions={{
      addResourceRequirement,
      addTask,
      addWorkPackage,
      getIDs,
      getResourceRequirement,
      getResourceRequirements,
      getTask,
      getTasks,
      getTaskResourceRequirements,
      getWorkPackage,
      getWorkPackages,
      getWorkPackageTasks,
      getWorkPackageResourceRequirements,
      removeResourceRequirement,
      removeTask,
      removeWorkPackage,
      sortResourceRequirements,
      sortTasks,
      sortWorkPackages,
      sumResourceRequirementCosts,
      updateResourceRequirement,
      updateTask,
      updateWorkPackage,
    }}
    project={project}
    updateProject={props.updateProject}
  />
}

export default PlanContainer
