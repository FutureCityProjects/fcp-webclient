import { ToastOptions, TypeOptions } from "react-toastify"

export enum NotificationActionTypes {
  AddNotification = "ADD_NOTIFICATION",
  RemoveNotification = "REMOVE_NOTIFICATION",
}

export interface INotificationAction {
  type: NotificationActionTypes
}

export interface IAddNotificationAction extends INotificationAction {
  content: string
  options: ToastOptions
  type: NotificationActionTypes.AddNotification
}

export interface IRemoveNotificationAction extends INotificationAction {
  id: string
  type: NotificationActionTypes.RemoveNotification
}

export type NotificationActions =
  IAddNotificationAction | IRemoveNotificationAction

export const addNotificationAction =
  (content: string, type: TypeOptions = "success", options: ToastOptions = {}): IAddNotificationAction => ({
    content,
    options: { type, ...options },
    type: NotificationActionTypes.AddNotification,
  })

export const removeNotificationAction = (id: string): IRemoveNotificationAction => ({
  id,
  type: NotificationActionTypes.RemoveNotification,
})
