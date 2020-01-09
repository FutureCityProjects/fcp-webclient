import { ToastOptions, TypeOptions } from "react-toastify"

export enum NotificationActionTypes {
  ADD_NOTIFICATION = "ADD_NOTIFICATION",
  REMOVE_NOTIFICATION = "REMOVE_NOTIFICATION",
}

export interface INotificationAction {
  type: NotificationActionTypes
}

export interface IAddNotificationAction extends INotificationAction {
  content: string
  options: ToastOptions
  type: NotificationActionTypes.ADD_NOTIFICATION
}

export interface IRemoveNotificationAction extends INotificationAction {
  id: string
  type: NotificationActionTypes.REMOVE_NOTIFICATION
}

export type NotificationActions =
  IAddNotificationAction | IRemoveNotificationAction

export const addNotificationAction =
  (content: string, type: TypeOptions = "success", options: ToastOptions = {}): IAddNotificationAction => ({
    content,
    options: { type, ...options },
    type: NotificationActionTypes.ADD_NOTIFICATION,
  })

export const removeNotificationAction = (id: string): IRemoveNotificationAction => ({
  id,
  type: NotificationActionTypes.REMOVE_NOTIFICATION,
})
