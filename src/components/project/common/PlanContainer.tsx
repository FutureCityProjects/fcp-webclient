import React, { useState } from "react"
import uuidv1 from "uuid/v1"

import { IProject, IProjectTask, IResourceRequirement, IWorkPackage, ResourceSourceType } from "api/schema"
import { useTranslation } from "services/i18n"

export interface IPlanFunctions {
  addResourceRequirement: any
  addTask: any
  addWorkPackage: any
  getIDs: (list: any[]) => string[]
  getImplementationBegin: any
  getImplementationTime: () => number
  getResourceRequirement: any
  getResourceRequirements: any
  getResourceRequirementSources: any
  getResourceRequirementsBySourceType: any
  getTask: any
  getTasks: any
  getTaskResourceRequirements: any
  getWorkPackage: any
  getWorkPackages: any
  getWorkPackageMonths: (id: string) => number[]
  getWorkPackageTasks: any
  getWorkPackageResourceRequirements: any
  removeResourceRequirement: (id: string) => void
  removeTask: (id: string) => void
  removeWorkPackage: (id: string) => void
  sortResourceRequirements
  sortTasks
  sortWorkPackages
  sumResourceRequirementCosts: any
  updateImplementationTime: (implementationTime: number, implementationBegin: Date) => void
  updateResourceRequirement: (resource: IResourceRequirement) => void
  updateTask: (task: IProjectTask) => void
  updateWorkPackage: (wp: IWorkPackage) => void
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
 *
 * @see https://reactjs.org/docs/react-component.html
 *
 * @todo refactor all the functions to a separate helper in /services
 *
 * @param props IPlanProps
 */
const PlanContainer: React.FC<IProps> = (props: IProps) => {
  const { t } = useTranslation()
  const [project, setProject] = useState(props.project)
  const getIDs = (list: any[]): string[] => list.map((e) => e.id as string)

  const getTasks = (): IProjectTask[] =>
    project.tasks || []
  const getTask = (id: string): IProjectTask =>
    getTasks().find((e) => e.id === id)
  const sortTasks = (list: IProjectTask[]): IProjectTask[] =>
    list.sort((a, b) => a.description.toLowerCase() > b.description.toLowerCase() ? 1 : -1)

  const getWorkPackages = (): IWorkPackage[] =>
    project.workPackages || []
  const getWorkPackage = (id: string): IWorkPackage =>
    getWorkPackages().find((w) => w.id === id)
  const getWorkPackageTasks = (id: string) =>
    getTasks().filter((e) => id ? e.workPackage === id : !e.workPackage)
  const getWorkPackageMonths = (id: string) => {
    const tasks = getWorkPackageTasks(id)
    const months: number[] = []
    tasks.forEach((e) => months.push(...e.months))

    return months
      .filter((m, i, self) => self.indexOf(m) === i)
      .sort((a, b) => a > b ? 1 : -1)
  }
  const sortWorkPackages = (list: IWorkPackage[]): IWorkPackage[] =>
    list.sort((a, b) => a.order > b.order ? 1 : -1)

  const getResourceRequirements = (): IResourceRequirement[] =>
    project.resourceRequirements || []
  const getResourceRequirement = (id: string): IResourceRequirement =>
    getResourceRequirements().find((r) => r.id === id)
  const getTaskResourceRequirements = (id: string): IResourceRequirement[] =>
    getResourceRequirements().filter((r) => r.task === id)
  const getWorkPackageResourceRequirements = (id: string): IResourceRequirement[] => {
    const ids = getIDs(getWorkPackageTasks(id))
    return (project.resourceRequirements || []).filter((r) => ids.includes(r.task))
  }
  const sortResourceRequirements = (list: IResourceRequirement[]): IResourceRequirement[] =>
    list.sort((a, b) => a.description.toLowerCase() > b.description.toLowerCase() ? 1 : -1)

  const getResourceRequirementSources = () =>
    getResourceRequirements()
      .map((r) => r.source)
      .filter((m, i, self) => m && self.indexOf(m) === i)
      .sort((a, b) => a > b ? 1 : -1)
  const getResourceRequirementsBySourceType = (type: ResourceSourceType) =>
    getResourceRequirements().filter((r) => r.sourceType && r.sourceType === type)
  const sumResourceRequirementCosts = (requirements: IResourceRequirement[]): number =>
    requirements.reduce((s, r) => s + (r.cost || 0), 0)

  const getImplementationBegin = () => {
    if (project.implementationBegin) {
      return project.implementationBegin
    }

    const month = new Date()
    month.setMonth(month.getMonth() + 1, 1)
    return month
  }
  const getImplementationTime = (): number => project.implementationTime || 12

  const addResourceRequirement = (resource: IResourceRequirement) => {
    resource.id = uuidv1()
    setProject({ ...project, resourceRequirements: [...getResourceRequirements(), resource] })
  }
  const updateResourceRequirement = (resource: IResourceRequirement) => {
    const updatedResources = getResourceRequirements()
      .map((r) => r.id === resource.id ? { ...r, ...resource } : r)
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
    const updatedTasks = getTasks()
      .map((e) => e.id === task.id ? { ...e, ...task } : e)
    setProject({ ...project, tasks: updatedTasks })
  }
  const removeTask = (id: string): void => {
    const hasReqs = getTaskResourceRequirements(id).length > 0
    if (hasReqs) {
      if (!confirm(t("message.project.confirmDelete.taskWithResourceRequirements"))) {
        return
      }
    }

    // also delete all assigned resourceRequirements
    const updatedReqs = (project.resourceRequirements || []).filter((r) => r.task !== id)

    setProject({
      ...project,
      resourceRequirements: updatedReqs,
      tasks: getTasks().filter((e) => e.id !== id)
    })
  }

  const addWorkPackage = (wp: IWorkPackage): void => {
    wp.id = uuidv1()
    wp.order = getWorkPackages().length + 1
    setProject({ ...project, workPackages: [...getWorkPackages(), wp] })
  }
  const updateWorkPackage = (wp: IWorkPackage): void => {
    const updatedPackages = getWorkPackages()
      .map((w) => w.id === wp.id ? { ...w, ...wp } : w)
    setProject({ ...project, workPackages: updatedPackages })
  }
  const removeWorkPackage = (id: string): void => {
    const hasTasks = getWorkPackageTasks(id).length > 0
    if (hasTasks) {
      if (!confirm(t("message.project.confirmDelete.workPackageWithTasks"))) {
        return
      }
    }

    // reset all tasks in this package to unassigned
    const updatedTasks = getTasks().map((e) => e.workPackage === id
      ? { ...e, workPackage: null }
      : e
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

  const updateImplementationTime = (implementationTime: number, implementationBegin: Date): void => {
    // if the implementationTime is reduced, remove any planned monthe after the new value
    const updatedTasks = getTasks().map((task) => ({
      ...task,
      months: task.months.filter((m) => m <= implementationTime)
    }))

    setProject({
      ...project,
      implementationBegin,
      implementationTime,
      tasks: updatedTasks,
    })
  }

  return <props.component
    functions={{
      addResourceRequirement,
      addTask,
      addWorkPackage,
      getIDs,
      getImplementationBegin,
      getImplementationTime,
      getResourceRequirement,
      getResourceRequirements,
      getResourceRequirementSources,
      getResourceRequirementsBySourceType,
      getTask,
      getTasks,
      getTaskResourceRequirements,
      getWorkPackage,
      getWorkPackages,
      getWorkPackageMonths,
      getWorkPackageTasks,
      getWorkPackageResourceRequirements,
      removeResourceRequirement,
      removeTask,
      removeWorkPackage,
      sortResourceRequirements,
      sortTasks,
      sortWorkPackages,
      sumResourceRequirementCosts,
      updateImplementationTime,
      updateResourceRequirement,
      updateTask,
      updateWorkPackage,
    }}
    project={project}
    updateProject={props.updateProject}
  />
}

export default PlanContainer
